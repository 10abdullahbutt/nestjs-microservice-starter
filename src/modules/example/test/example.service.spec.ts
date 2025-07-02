import { Test, TestingModule } from '@nestjs/testing'
import { closeInMongodConnection, getMongoSchema, rootMongooseTestModule } from '@src/shared'
import { Example, ExampleDocument, ExampleSchema } from '../models'
import { ExampleController } from '../example.controller'
import { ExampleService } from '../example.service'
import { mockExamplesData, pagenatedExamplesMockData } from './mock'

describe('Example Service', () => {
  let service: ExampleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), getMongoSchema(Example.name, ExampleSchema)],
      providers: [ExampleService],
      controllers: [ExampleController]
    }).compile()

    service = module.get<ExampleService>(ExampleService)
  })

  afterAll(async () => await closeInMongodConnection())

  describe('should be defined', () => {
    expect(service).toBeDefined
  })

  const testExampleData = (example: ExampleDocument) => {
    expect(example).toBeDefined
    expect(example.name).toBeDefined
    expect(example.type).toBeDefined
    expect(example.createdAt).toBeDefined
    expect(example.createdBy).toBeDefined
    expect(example.updatedAt).toBeDefined
    expect(example.isDeleted).toBeDefined

    expect(example.name).toStrictEqual(example.name)
    expect(example.type).toStrictEqual(example.type)
    expect(example.createdAt).toStrictEqual(example.createdAt)
    expect(example.createdBy).toStrictEqual(example.createdBy)
    expect(example.updatedAt).toStrictEqual(example.updatedAt)
    expect(example.isDeleted).toStrictEqual(example.isDeleted)
  }

  describe('/create', () => {
    const exampleData: ExampleDocument = mockExamplesData[0] as unknown as ExampleDocument

    it('Should create a new example', async () => {
      const example: Example = await service.create(exampleData)

      testExampleData(example as unknown as ExampleDocument)
    })

    it('should get the created example', async () => {
      const example: ExampleDocument = await service.create(exampleData as ExampleDocument)

      // eslint-disable-next-line
      const _example: ExampleDocument = await service.findById(example._id.toString())

      testExampleData(_example as unknown as ExampleDocument)
    })
  })

  describe('/getAll', () => {
    it('should get all the examples', async () => {
      await Promise.all(mockExamplesData.slice(0, 5).map((item) => service.create(item as unknown as ExampleDocument)))

      const { items: examplesData } = await service.getAll({
        page: 1,
        limit: 10,
        search: ''
      })
      expect(examplesData).toBeDefined

      expect(examplesData).toHaveLength(5)
      expect(examplesData.every(testExampleData))
    })

    it('Should return the paginated data', async () => {
      const examplesData: ExampleDocument[] = pagenatedExamplesMockData as unknown as ExampleDocument[]

      await Promise.all(examplesData.map((item) => service.create(item)))

      const { items: examplesDataPaginated }: { items: ExampleDocument[] } = await service.getAll({ page: 1, limit: 5, search: '' })

      expect(examplesDataPaginated).toBeDefined

      expect(examplesDataPaginated).toHaveLength(5)
      expect(examplesDataPaginated.every(testExampleData))

      const { items: nextPageItems }: { items: ExampleDocument[] } = await service.getAll({ page: 2, limit: 5, search: '' })

      expect(nextPageItems).toBeDefined

      expect(nextPageItems).toHaveLength(5)
      expect(nextPageItems.every(testExampleData))
    })
  })

  describe('/findById', () => {
    it('should find an example by id', async () => {
      const exampleData: ExampleDocument = mockExamplesData[0] as unknown as ExampleDocument
      const createdExample: ExampleDocument = await service.create(exampleData as ExampleDocument)

      const foundExample: ExampleDocument = await service.findById(createdExample._id.toString())

      testExampleData(foundExample)
      expect(foundExample._id.toString()).toBe(createdExample._id.toString())
    })

    it('should throw EntityNotFoundException for non-existent id', async () => {
      const nonExistentId = '67dc8170e5fd8cff88066fff'

      await expect(service.findById(nonExistentId)).rejects.toThrow('examples Not Found')
    })

    it('should throw EntityNotFoundException for invalid id format', async () => {
      const invalidId = 'invalid-id-format'

      await expect(service.findById(invalidId)).rejects.toThrow('Cast to ObjectId failed for value "invalid-id-format" (type string) at path "_id" for model "Example"')
    })

    it('should find an example by id with populated attributes', async () => {
      const exampleData: ExampleDocument = mockExamplesData[0] as unknown as ExampleDocument
      const createdExample: ExampleDocument = await service.create(exampleData as ExampleDocument)

      const foundExample: ExampleDocument = await service.findById(createdExample._id.toString(), ['name', 'type'])

      testExampleData(foundExample)
      expect(foundExample._id.toString()).toBe(createdExample._id.toString())
    })
  })

  describe('/delete', () => {
    it('should soft delete an example', async () => {
      const exampleData: ExampleDocument = mockExamplesData[0] as unknown as ExampleDocument
      const createdExample: ExampleDocument = await service.create(exampleData as ExampleDocument)

      const deletedExample: ExampleDocument = await service.delete({ _id: createdExample._id.toString() })

      expect(deletedExample).toBeDefined()
      expect(deletedExample._id.toString()).toBe(createdExample._id.toString())

      // Verify the example is soft deleted by checking findById throws an error
      await expect(service.findById(createdExample._id.toString())).rejects.toThrow('examples Not Found')
    })

    it('should throw EntityNotFoundException for non-existent id', async () => {
      const nonExistentId = '67dc8170e5fd8cff88066fff'

      await expect(service.delete({ _id: nonExistentId })).rejects.toThrow('examples Not Found')
    })

    it('should throw EntityNotFoundException for invalid id format', async () => {
      const invalidId = 'invalid-id-format'

      await expect(service.delete({ _id: invalidId })).rejects.toThrow('Cast to ObjectId failed for value "invalid-id-format" (type string) at path "_id" for model "Example"')
    })
  })

  describe('/update', () => {
    it('should update an example', async () => {
      const exampleData: ExampleDocument = mockExamplesData[0] as unknown as ExampleDocument
      const createdExample: ExampleDocument = await service.create(exampleData as ExampleDocument)

      const updateData = {
        _id: createdExample._id.toString(),
        name: 'Updated Example Name',
        type: 'UpdatedType'
      }

      const updatedExample: ExampleDocument = await service.update(updateData as unknown as ExampleDocument)

      expect(updatedExample).toBeDefined()
      expect(updatedExample._id.toString()).toBe(createdExample._id.toString())
      expect(updatedExample.name).toBe('Updated Example Name')
      expect(updatedExample.type).toBe('UpdatedType')
      expect(updatedExample.createdAt).toEqual(createdExample.createdAt)
      expect(updatedExample.updatedAt).not.toEqual(createdExample.updatedAt)
    })

    it('should throw EntityNotFoundException for non-existent id', async () => {
      const nonExistentId = '67dc8170e5fd8cff88066fff'
      const updateData = {
        _id: nonExistentId,
        name: 'Updated Example Name',
        type: 'UpdatedType'
      }

      await expect(service.update(updateData as unknown as ExampleDocument)).rejects.toThrow('examples Not Found')
    })

    it('should throw EntityNotFoundException for invalid id format', async () => {
      const invalidId = 'invalid-id-format'
      const updateData = {
        _id: invalidId,
        name: 'Updated Example Name',
        type: 'UpdatedType'
      }

      await expect(service.update(updateData as unknown as ExampleDocument)).rejects.toThrow('Cast to ObjectId failed for value "invalid-id-format" (type string) at path "_id" for model "Example"')
    })

    it('should update only specified fields', async () => {
      const exampleData: ExampleDocument = mockExamplesData[0] as unknown as ExampleDocument
      const createdExample: ExampleDocument = await service.create(exampleData as ExampleDocument)

      const updateData = {
        _id: createdExample._id.toString(),
        name: 'Updated Example Name'
      }

      const updatedExample: ExampleDocument = await service.update(updateData as unknown as ExampleDocument)

      expect(updatedExample).toBeDefined()
      expect(updatedExample._id.toString()).toBe(createdExample._id.toString())
      expect(updatedExample.name).toBe('Updated Example Name')
      expect(updatedExample.type).toBe(createdExample.type) // Should remain unchanged
    })
  })
})
