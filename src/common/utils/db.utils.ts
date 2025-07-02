/* eslint-disable */
import { Model, Schema, Types } from 'mongoose'
import { getPaginationParams } from '@src/shared'
import { IPaginated, IPaginatedData } from '../interface/interface'
import { capitalize } from './index'

export const createMongoId = () => new Types.ObjectId()

export const castToMongoId = (id: string) => new Types.ObjectId(id)

export const getModelFactory = (schema: Schema) => {
  return () => {
    schema.post(/find/, function (docs: any) {
      if (this._mongooseOptions.lean) {
        if (Array.isArray(docs)) {
          docs.forEach((doc: any) => {
            delete doc.__v
          })
        } else if (docs) delete docs.__v
        return docs
      }
    })
    return schema
  }
}

export const getSchemaOptions = () => ({
  timestamps: true
  // toJSON: {
  //   transform: (_, obj) => {
  //     delete obj.__v
  //   }
  // },
  // toObject: {
  //   transform: (_, obj) => {
  //     delete obj.__v
  //   }
  // }
})

export const getSubSchemaOptions = (_id: boolean = false) => {
  return {
    _id,
    versionKey: false,
    timestamps: false
  }
}

export const mongooseErrorHandler = (error: any) => {
  console.log(error)
  const errors = []
  if (error.name === 'ValidationError') {
    for (const field in error.errors) {
      if (error.errors[field].name == 'CastError') {
        errors.push({
          param: error.errors[field].path,
          msg: `${capitalize(error.errors[field].path)} type is invalid`
        })
      }
      if (error.errors[field].name == 'ValidatorError') {
        if (error.errors[field].kind == 'required') {
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} is required`
          })
        } else if (['min', 'max'].includes(error.errors[field].kind)) {
          const matches = error.errors[field].message.match(/\((\d+)\)/g)
          const allowedCharacters = matches[matches.length - 1]
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} ${error.errors[field].kind == 'min' ? 'must not be less than ' + allowedCharacters : 'must not exceed ' + allowedCharacters}`
          })
        } else if (['minlength', 'maxlength'].includes(error.errors[field].kind)) {
          const matches = error.errors[field].message.match(/\((\d+)\)/g)
          const allowedCharacters = matches[matches.length - 1]
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} ${
              error.errors[field].kind == 'minlength' ? 'must not be less than ' + allowedCharacters + ' characters' : 'must not exceed ' + allowedCharacters + ' characters'
            }`
          })
        } else if (error.errors[field].kind == 'enum') {
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} must be one of these` + ` [${error.errors[field].properties.enumValues}]`
          })
        } else {
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} is invalid`
          })
        }
      }
    }
  } else if (error.name === 'MongoServerError') {
    if (error.code === 11000) {
      errors.push({
        param: Object.keys(error.keyPattern)[0],
        msg: `${capitalize(Object.keys(error.keyPattern)[0])} already exists`
      })
    }
  }
  console.log({ errors })
  return errors
  // throw new BadRequestException(errors, "Validation Error");
}

export const getPaginatedData = async <T>(inputParams: IPaginated, model: Model<T>, populateAttributes?: string[], filters?: Object): Promise<IPaginatedData<T>> => {
  const { skip, limit, page } = getPaginationParams(inputParams)
  //eslint-disable-next-line
  let query: any = { ...filters, isDeleted: false }
  query = { ...query }
  let queryBuilder = model
    .find(query)
    .populate(populateAttributes)
    .populate({
      path: 'createdBy'
    })
    .sort({ createdAt: -1 })

  if (!inputParams.withoutPagination) queryBuilder = queryBuilder.skip(skip).limit(limit)

  const [totalCount, items] = await Promise.all([model.countDocuments(query), queryBuilder])

  const totalPages = Math.ceil(totalCount / limit)

  if (inputParams.withoutPagination) {
    return {
      items,
      page: 1,
      limit: totalCount,
      total: totalCount,
      totalPages: 1
    }
  }

  return {
    items,
    page,
    limit,
    total: totalCount,
    totalPages
  }
}
