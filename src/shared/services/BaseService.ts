import { Model } from 'mongoose'
import { getPaginatedData } from '..'
import { EntityNotFoundException } from '../exceptions'
import { IDeleteById, IGetAll, IPaginatedData } from '../interface/interface'

export abstract class BaseMongoCrudService<T> {
  protected model: Model<T>

  constructor(model: Model<T>) {
    this.model = model
  }

  create(inputParams: T) {
    return this.model.create(inputParams)
  }

  async findById(_id: string, populateAttributes?: string[]) {
    const record = await this.model.findOne({ _id, isDeleted: false }).populate(populateAttributes).populate({
      path: 'createdBy'
    })
    if (!record) throw new EntityNotFoundException(this.model.collection.name)
    return record
  }

  async update(input: T) {
    //eslint-disable-next-line
    const { _id } = input as any
    //eslint-disable-next-line
    const record = await this.findById(_id)

    if (record) return await this.model.findOneAndUpdate({ _id }, { $set: input }, { new: true })
    else throw new EntityNotFoundException(this.model.collection.name)
  }

  async delete(input: IDeleteById) {
    const record: T = await this.model.findOneAndUpdate({ _id: input._id }, { $set: { isDeleted: true } })
    if (!record) throw new EntityNotFoundException(this.model.collection.name)

    return record
  }

  getAll(inputParams: IGetAll): Promise<IPaginatedData<T>> {
    return getPaginatedData(inputParams, this.model)
  }
}
