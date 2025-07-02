import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseMongooseSchema } from '@src/shared'
import { getSchemaOptions } from '@src/shared/utils'
import { Document } from 'mongoose'

export interface ExampleDocument extends Example, Document {}

@Schema(getSchemaOptions())
export class Example extends BaseMongooseSchema {
  @Prop({ required: true, index: true })
  name: string

  @Prop()
  type: string
}

export const ExampleSchema = SchemaFactory.createForClass(Example)
