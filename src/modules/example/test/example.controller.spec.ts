import { Test, TestingModule } from '@nestjs/testing';
import { ExampleController } from '../example.controller';
import { ExampleService } from '../example.service';

describe('ExampleController', () => {
  let controller: ExampleController;
  let service: ExampleService;

  const mockExampleService = {
    create: jest.fn(),
    getAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExampleController],
      providers: [
        {
          provide: ExampleService,
          useValue: mockExampleService,
        },
      ],
    }).compile();

    controller = module.get<ExampleController>(ExampleController);
    service = module.get<ExampleService>(ExampleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new example', async () => {
      const createExampleDto = {
        name: 'Test Example',
        type: 'TestType',
      };

      const expectedResult = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test Example',
        type: 'TestType',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      mockExampleService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createExampleDto);

      expect(service.create).toHaveBeenCalledWith(createExampleDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle special characters in example name and type', async () => {
      const createExampleDto = {
        name: 'Special Example Name!@#$%^&*()_+-=[]{}|;:,.<>?',
        type: 'Special-Type_123',
      };

      const expectedResult = {
        _id: '507f1f77bcf86cd799439011',
        ...createExampleDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      mockExampleService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createExampleDto);

      expect(service.create).toHaveBeenCalledWith(createExampleDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle unicode characters', async () => {
      const createExampleDto = {
        name: 'Example with Unicode: 中文, Español, Français, العربية',
        type: 'Unicode-Type-类型',
      };

      const expectedResult = {
        _id: '507f1f77bcf86cd799439011',
        ...createExampleDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      mockExampleService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createExampleDto);

      expect(service.create).toHaveBeenCalledWith(createExampleDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getAllExamplesList', () => {
    it('should return empty array when no examples exist', async () => {
      const getAllDto = {
        page: 1,
        limit: 10,
        search: '',
      };

      const expectedResult = {
        items: [] as any[],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result).toEqual(expectedResult);
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should return paginated examples', async () => {
      const getAllDto = {
        page: 1,
        limit: 5,
        search: '',
      };

      const mockExamples = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Example 1',
          type: 'Type A',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'Example 2',
          type: 'Type B',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      ];

      const expectedResult = {
        items: mockExamples,
        page: 1,
        limit: 5,
        total: 2,
        totalPages: 1,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result).toEqual(expectedResult);
      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should handle search functionality', async () => {
      const getAllDto = {
        page: 1,
        limit: 10,
        search: 'Dashboard',
      };

      const mockExamples = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Dashboard Admin',
          type: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          _id: '507f1f77bcf86cd799439012',
          name: 'User Dashboard',
          type: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      ];

      const expectedResult = {
        items: mockExamples,
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result.items).toHaveLength(2);
      expect(
        result.items.every((example: any) => example.name.toLowerCase().includes('dashboard'))
      ).toBe(true);
    });

    it('should handle edge case parameters', async () => {
      const getAllDto = {
        page: Number.MAX_SAFE_INTEGER,
        limit: Number.MAX_SAFE_INTEGER,
        search: '',
      };

      const expectedResult = {
        items: [] as any[],
        page: Number.MAX_SAFE_INTEGER,
        limit: Number.MAX_SAFE_INTEGER,
        total: 0,
        totalPages: 0,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('should handle special characters in search', async () => {
      const getAllDto = {
        page: 1,
        limit: 10,
        search: 'special@#$%',
      };

      const expectedResult = {
        items: [] as any[],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result).toBeDefined();
    });

    it('should handle unicode search terms', async () => {
      const getAllDto = {
        page: 1,
        limit: 10,
        search: '中文',
      };

      const mockExamples = [
        {
          _id: '507f1f77bcf86cd799439011',
          name: 'Example with 中文',
          type: 'Unicode',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      ];

      const expectedResult = {
        items: mockExamples,
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result.items).toHaveLength(1);
    });

    it('should handle empty search parameters', async () => {
      const getAllDto = {
        page: 1,
        limit: 10,
        search: '',
      };

      const expectedResult = {
        items: [] as any[],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
    });

    it('should handle whitespace-only search', async () => {
      const getAllDto = {
        page: 1,
        limit: 10,
        search: '   ',
      };

      const expectedResult = {
        items: [] as any[],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

      mockExampleService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAllExamplesList(getAllDto);

      expect(service.getAll).toHaveBeenCalledWith(getAllDto);
      expect(result).toBeDefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle create and then retrieve in list', async () => {
      const createExampleDto = {
        name: 'Integration Test Example',
        type: 'IntegrationType',
      };

      const createdExample = {
        _id: '507f1f77bcf86cd799439011',
        ...createExampleDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      const listResult = {
        items: [createdExample],
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      };

      mockExampleService.create.mockResolvedValue(createdExample);
      mockExampleService.getAll.mockResolvedValue(listResult);

      // Create example
      const created = await controller.create(createExampleDto);
      expect(created).toEqual(createdExample);

      // Get list
      const list = await controller.getAllExamplesList({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(list.items).toHaveLength(1);
      expect(list.items[0]._id).toBe(createdExample._id);
      expect(list.items[0].name).toBe(createExampleDto.name);
      expect(list.items[0].type).toBe(createExampleDto.type);
    });

    it('should handle multiple concurrent operations', async () => {
      const createExampleDto = {
        name: 'Concurrent Example',
        type: 'ConcurrentType',
      };

      const createdExample = {
        _id: '507f1f77bcf86cd799439011',
        ...createExampleDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      mockExampleService.create.mockResolvedValue(createdExample);

      // Send multiple concurrent create requests
      const promises = Array.from({ length: 5 }, () => controller.create(createExampleDto));

      const results = await Promise.all(promises);

      // All requests should succeed
      results.forEach((result) => {
        expect(result.name).toBe(createExampleDto.name);
        expect(result.type).toBe(createExampleDto.type);
      });

      expect(service.create).toHaveBeenCalledTimes(5);
    });
  });

  describe('Error handling', () => {
    it('should handle service errors gracefully', async () => {
      const createExampleDto = {
        name: '',
        type: '',
      };

      const error = new Error('Validation failed');
      mockExampleService.create.mockRejectedValue(error);

      await expect(controller.create(createExampleDto)).rejects.toThrow('Validation failed');
    });

    it('should handle getAll service errors', async () => {
      const getAllDto = {
        page: 1,
        limit: 10,
        search: '',
      };

      const error = new Error('Database connection failed');
      mockExampleService.getAll.mockRejectedValue(error);

      await expect(controller.getAllExamplesList(getAllDto)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
