export interface IPaginatedData<T> {
  page?: number
  limit?: number
  total?: number
  totalPages: number
  items: T[]
}

export interface IPaginated {
  limit: number
  page: number
  search?: string
  withoutPagination?: boolean
}

export interface IGetById {
  _id: string
}

export interface IDeleteById {
  _id: string
}

export interface IGetAll {
  limit: number
  page: number
  search?: string
}

//eslint-disable-next-line
export interface IMongoService<T, D> {
  create(input: T | D): Promise<T>
  update(input: T): Promise<T>
  delete(input: IDeleteById): Promise<T>
  get(input: IGetById): Promise<T>
  getAll(input: IGetAll): Promise<IPaginatedData<T>>
}

export interface IExtendedService<T, D> extends IMongoService<T, D> {
  createNew(input: D): Promise<T>
}
