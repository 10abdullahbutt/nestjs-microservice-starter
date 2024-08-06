import { IDeleteById, IGetAll, IGetById } from '../interface/interface'
import { BaseMongoCrudService } from './BaseService'

export abstract class BaseController<T> {
  private service: BaseMongoCrudService<T>

  constructor(service: BaseMongoCrudService<T>) {
    this.service = service
  }

  create(inputParams: T) {
    return this.service.create(inputParams as unknown as T)
  }

  update(inputParams: T) {
    return this.service.update(inputParams)
  }

  delete(inputParams: IDeleteById) {
    return this.service.delete(inputParams)
  }

  getAll(inputParams: IGetAll) {
    return this.service.getAll(inputParams)
  }

  get(inputParams: IGetById) {
    //eslint-disable-next-line
    return this.service.findById(inputParams._id)
  }
}
