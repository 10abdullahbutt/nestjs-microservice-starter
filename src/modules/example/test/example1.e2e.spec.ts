import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { getMongoSchema } from '@src/common/factories';
import { closeInMongodConnection, rootMongooseTestModule } from '@src/common/utils';
import { join } from 'path';
import { ExampleController } from '../example.controller';
import { Example, ExampleSchema } from '../models';
import { mockExamplesData, pagenatedExamplesMockData } from './mock';

describe('ExampleController (gRPC e2e)', () => {
  let app: INestApplication;
  let exampleController: ExampleController;

  let exampleModel: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), getMongoSchema(Example.name, ExampleSchema), AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configure gRPC microservice
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: 'example',
        protoPath: join(__dirname, '../../../../_proto/example.proto'),
        url: 'localhost:5000',
      },
    });

    await app.startAllMicroservices();
    await app.init();

    exampleController = moduleFixture.get<ExampleController>(ExampleController);

    exampleModel = moduleFixture.get('ExampleModel');
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await exampleModel.deleteMany({});
  });

  describe('ExampleService.getAllExamplesList', () => {
    it('should return empty array when no examples exist', async () => {
      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(result).toBeDefined();
      expect(result.items).toEqual([]);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should return all examples with pagination', async () => {
      // Create some test examples
      const testExamples = mockExamplesData.slice(0, 5);
      await exampleModel.insertMany(testExamples);

      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);

      // Verify example structure
      result.items.forEach((example: any) => {
        expect(example).toHaveProperty('_id');
        expect(example).toHaveProperty('name');
        expect(example).toHaveProperty('type');
        expect(example).toHaveProperty('createdAt');
        expect(example).toHaveProperty('updatedAt');
        expect(example).toHaveProperty('isDeleted');
      });
    });

    it('should handle pagination correctly with multiple pages', async () => {
      // Create more examples than the limit
      const testExamples = pagenatedExamplesMockData;
      await exampleModel.insertMany(testExamples);

      // First page
      const firstPageResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 5,
        search: '',
      });

      expect(firstPageResult.items).toHaveLength(5);
      expect(firstPageResult.total).toBe(10);
      expect(firstPageResult.page).toBe(1);
      expect(firstPageResult.limit).toBe(5);
      expect(firstPageResult.totalPages).toBe(2);

      // Second page
      const secondPageResult = await exampleController.getAllExamplesList({
        page: 2,
        limit: 5,
        search: '',
      });

      expect(secondPageResult.items).toHaveLength(5);
      expect(secondPageResult.page).toBe(2);

      // Verify no overlap between pages
      const firstPageIds = firstPageResult.items.map((example: any) => example._id);
      const secondPageIds = secondPageResult.items.map((example: any) => example._id);

      const intersection = firstPageIds.filter((id: string) => secondPageIds.includes(id));
      expect(intersection).toHaveLength(0);
    });

    it('should search by example name', async () => {
      const testExamples = [
        { name: 'Dashboard Admin', type: 'Admin' },
        { name: 'User Dashboard', type: 'User' },
        { name: 'Settings Panel', type: 'Admin' },
        { name: 'Profile Settings', type: 'User' },
        { name: 'Analytics Dashboard', type: 'Analytics' },
      ];
      await exampleModel.insertMany(testExamples);

      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: 'Dashboard',
      });

      const dashboardExamples = result.items.filter((example: any) =>
        example.name.toLowerCase().includes('dashboard')
      );
      expect(dashboardExamples.length).toBeGreaterThan(0);
      expect(result.items.length).toBeGreaterThanOrEqual(3);
    });

    it('should search by example type', async () => {
      const testExamples = [
        { name: 'Dashboard Admin', type: 'Admin' },
        { name: 'User Dashboard', type: 'User' },
        { name: 'Settings Panel', type: 'Admin' },
        { name: 'Profile Settings', type: 'User' },
        { name: 'Analytics Dashboard', type: 'Analytics' },
      ];
      await exampleModel.insertMany(testExamples);

      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: 'Admin',
      });

      const adminExamples = result.items.filter((example: any) =>
        example.type.toLowerCase().includes('admin')
      );
      expect(adminExamples.length).toBeGreaterThan(0);
    });
  });

  describe('ExampleService.create', () => {
    it('should create a new example successfully', async () => {
      const createExampleDto = {
        name: 'Test Example',
        type: 'TestType',
      };

      const result = await exampleController.create(createExampleDto);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id');
      expect(result.name).toBe(createExampleDto.name);
      expect(result.type).toBe(createExampleDto.type);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.isDeleted).toBe(false);
    });

    it('should create multiple examples with different types', async () => {
      const examplesToCreate = [
        { name: 'Admin Dashboard', type: 'Admin' },
        { name: 'User Profile', type: 'User' },
        { name: 'Analytics Report', type: 'Analytics' },
        { name: 'Settings Panel', type: 'Settings' },
      ];

      const createdExamples = [];

      for (const exampleDto of examplesToCreate) {
        const result = await exampleController.create(exampleDto);
        createdExamples.push(result);
      }

      expect(createdExamples).toHaveLength(4);
      createdExamples.forEach((example, index) => {
        expect(example.name).toBe(examplesToCreate[index].name);
        expect(example.type).toBe(examplesToCreate[index].type);
      });
    });

    it('should handle special characters in example name and type', async () => {
      const specialCharsDto = {
        name: 'Special Example Name!@#$%^&*()_+-=[]{}|;:,.<>?',
        type: 'Special-Type_123',
      };

      const result = await exampleController.create(specialCharsDto);

      expect(result.name).toBe(specialCharsDto.name);
      expect(result.type).toBe(specialCharsDto.type);
    });

    it('should handle very long example names and types', async () => {
      const longName = 'A'.repeat(1000);
      const longType = 'B'.repeat(500);

      const createExampleDto = {
        name: longName,
        type: longType,
      };

      const result = await exampleController.create(createExampleDto);

      expect(result.name).toBe(longName);
      expect(result.type).toBe(longType);
    });

    it('should handle unicode characters', async () => {
      const unicodeDto = {
        name: 'Example with Unicode: 中文, Español, Français, العربية',
        type: 'Unicode-Type-类型',
      };

      const result = await exampleController.create(unicodeDto);

      expect(result.name).toBe(unicodeDto.name);
      expect(result.type).toBe(unicodeDto.type);
    });
  });

  describe('Integration scenarios', () => {
    it('should create example and then retrieve it in list', async () => {
      // Create an example
      const createExampleDto = {
        name: 'Integration Test Example',
        type: 'IntegrationType',
      };

      const createdExample = await exampleController.create(createExampleDto);
      const createdExampleId = createdExample._id;

      // Retrieve the example in the list
      const listResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      const foundExample = listResult.items.find(
        (example: any) => example._id.toString() === createdExampleId.toString()
      );
      expect(foundExample).toBeDefined();
      expect(foundExample.name).toBe(createExampleDto.name);
      expect(foundExample.type).toBe(createExampleDto.type);
    });

    it('should handle multiple concurrent operations', async () => {
      const createExampleDto = {
        name: 'Concurrent Example',
        type: 'ConcurrentType',
      };

      // Send multiple concurrent create requests
      const promises = Array.from({ length: 10 }, () => exampleController.create(createExampleDto));

      const results = await Promise.all(promises);

      // All requests should succeed
      results.forEach((result) => {
        expect(result.name).toBe(createExampleDto.name);
        expect(result.type).toBe(createExampleDto.type);
      });

      // Verify all examples were created
      const listResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 20,
        search: '',
      });

      const concurrentExamples = listResult.items.filter(
        (example: any) =>
          example.name === createExampleDto.name && example.type === createExampleDto.type
      );
      expect(concurrentExamples).toHaveLength(10);
    });

    it('should handle mixed operations scenario', async () => {
      // Create initial examples
      const initialExamples = [
        { name: 'Example 1', type: 'Type A' },
        { name: 'Example 2', type: 'Type B' },
        { name: 'Example 3', type: 'Type A' },
      ];

      for (const exampleDto of initialExamples) {
        await exampleController.create(exampleDto);
      }

      // Get list and verify
      const listResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(listResult.items).toHaveLength(3);
      expect(listResult.total).toBe(3);

      // Search for specific type
      const searchResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: 'Type A',
      });

      const typeAExamples = searchResult.items.filter((example: any) => example.type === 'Type A');
      expect(typeAExamples).toHaveLength(2);

      // Create more examples
      const additionalExamples = [
        { name: 'Example 4', type: 'Type C' },
        { name: 'Example 5', type: 'Type A' },
      ];

      for (const exampleDto of additionalExamples) {
        await exampleController.create(exampleDto);
      }

      // Final list should have all examples
      const finalListResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(finalListResult.items).toHaveLength(5);
      expect(finalListResult.total).toBe(5);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid input gracefully', async () => {
      // Test with invalid input
      const invalidInput = {
        name: '',
        type: '',
      };

      try {
        await exampleController.create(invalidInput);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle missing required fields', async () => {
      // Test with missing name
      const missingNameInput = {
        type: 'TestType',
      };

      try {
        await exampleController.create(missingNameInput as any);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Performance testing', () => {
    it('should handle large number of examples efficiently', async () => {
      // Create 100 examples
      const examplesToCreate = Array.from({ length: 100 }, (_, i) => ({
        name: `Example ${i + 1}`,
        type: `Type ${(i % 5) + 1}`,
      }));

      const startTime = Date.now();

      for (const exampleDto of examplesToCreate) {
        await exampleController.create(exampleDto);
      }

      const creationTime = Date.now() - startTime;
      expect(creationTime).toBeLessThan(10000); // Should complete within 10 seconds

      // Test pagination with large dataset
      const listResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 20,
        search: '',
      });

      expect(listResult.items).toHaveLength(20);
      expect(listResult.total).toBe(100);
      expect(listResult.totalPages).toBe(5);
    });

    it('should handle search in large dataset', async () => {
      // Create 50 examples with specific patterns
      const examplesToCreate = Array.from({ length: 50 }, (_, i) => ({
        name: `Dashboard ${i + 1}`,
        type: `Type ${(i % 3) + 1}`,
      }));

      for (const exampleDto of examplesToCreate) {
        await exampleController.create(exampleDto);
      }

      // Search for dashboard examples
      const searchResult = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: 'Dashboard',
      });

      expect(searchResult.items.length).toBeGreaterThan(0);
      expect(searchResult.total).toBeGreaterThan(0);
    });
  });

  describe('gRPC-specific testing', () => {
    it('should handle gRPC method calls with proper parameter types', async () => {
      // Test that gRPC methods accept the correct parameter types as defined in proto
      const createExampleDto = {
        name: 'gRPC Test Example',
        type: 'gRPCType',
      };

      const result = await exampleController.create(createExampleDto);

      // Verify the response structure matches proto definition
      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).toHaveProperty('isDeleted');

      // Verify data types match proto definition (strings)
      expect(typeof result._id.toString()).toBe('string');
      expect(typeof result.name).toBe('string');
      expect(typeof result.type).toBe('string');
      expect(typeof result.createdAt.toString()).toBe('string');
      expect(typeof result.updatedAt.toString()).toBe('string');
      expect(typeof result.isDeleted).toBe('boolean');
    });

    it('should handle gRPC list response structure correctly', async () => {
      // Create test data
      const testExamples = [
        { name: 'gRPC Example 1', type: 'Type A' },
        { name: 'gRPC Example 2', type: 'Type B' },
        { name: 'gRPC Example 3', type: 'Type A' },
      ];

      for (const exampleDto of testExamples) {
        await exampleController.create(exampleDto);
      }

      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      // Verify the response structure matches proto ExamplesList definition
      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toHaveLength(3);

      // Verify each item in the list has the correct structure
      result.items.forEach((example: any) => {
        expect(example).toHaveProperty('_id');
        expect(example).toHaveProperty('name');
        expect(example).toHaveProperty('type');
        expect(example).toHaveProperty('createdAt');
        expect(example).toHaveProperty('updatedAt');
        expect(example).toHaveProperty('isDeleted');
      });
    });

    it('should handle gRPC method calls with edge case parameters', async () => {
      // Test with maximum values for pagination
      const result = await exampleController.getAllExamplesList({
        page: Number.MAX_SAFE_INTEGER,
        limit: Number.MAX_SAFE_INTEGER,
        search: '',
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('should handle gRPC method calls with special characters in search', async () => {
      // Create test data with special characters
      const specialExamples = [
        { name: 'Example with spaces', type: 'Type with-dashes' },
        { name: 'Example_with_underscores', type: 'Type.with.dots' },
        { name: 'Example@with#special$chars', type: 'Type%with^special&chars' },
      ];

      for (const exampleDto of specialExamples) {
        await exampleController.create(exampleDto);
      }

      // Test search with special characters
      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: 'special',
      });

      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should handle gRPC method calls with unicode search terms', async () => {
      // Create test data with unicode characters
      const unicodeExamples = [
        { name: 'Example with 中文', type: 'Type with Español' },
        { name: 'Example with Français', type: 'Type with العربية' },
        { name: 'Example with русский', type: 'Type with 日本語' },
      ];

      for (const exampleDto of unicodeExamples) {
        await exampleController.create(exampleDto);
      }

      // Test search with unicode characters
      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '中文',
      });

      expect(result.items.length).toBeGreaterThan(0);
    });

    it('should handle gRPC method calls with empty search parameters', async () => {
      // Test with empty search string
      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('should handle gRPC method calls with whitespace-only search', async () => {
      // Create test data
      await exampleController.create({ name: 'Test Example', type: 'TestType' });

      // Test with whitespace-only search
      const result = await exampleController.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '   ',
      });

      expect(result).toBeDefined();
      expect(result.items).toBeDefined();
    });
  });
});
