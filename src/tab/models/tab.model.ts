import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseMongooseSchema, getSchemaOptions } from '@src/shared'
import { Document } from 'mongoose'

export interface TabDocument extends Tab, Document {}
@Schema(getSchemaOptions())
export class Tab extends BaseMongooseSchema {
  @Prop({ required: true, index: true })
  name: string

  @Prop()
  type: string
}

export const TabSchema = SchemaFactory.createForClass(Tab)
