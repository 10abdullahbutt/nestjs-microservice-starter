import { Prop, Schema } from '@nestjs/mongoose'
import mongoose from 'mongoose'

@Schema()
export abstract class BaseMongooseSchema {
  @Prop({ default: new Date() })
  createdAt?: Date

  @Prop({ default: new Date() })
  updatedAt?: Date

  @Prop({ default: false, index: true })
  isDeleted?: boolean

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserRole', index: true, required: false })
  createdBy?: string | mongoose.Schema.Types.ObjectId
}
