import { MongooseModule } from '@nestjs/mongoose'
import { Schema } from 'mongoose'
import { getModelFactory } from '../utils'

export const getMongoSchema = (name: string, schema: Schema) =>
  MongooseModule.forFeatureAsync([
    {
      name,
      useFactory: getModelFactory(schema)
    }
  ])
