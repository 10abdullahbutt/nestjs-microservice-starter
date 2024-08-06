import { MongooseModule } from '@nestjs/mongoose'
import { Schema } from 'mongoose'
import { getModelFactory } from '..'

export const getMongoSchema = (name: string, schema: Schema) =>
  MongooseModule.forFeatureAsync([
    {
      name,
      useFactory: getModelFactory(schema)
    }
  ])
