import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BaseMongoCrudService } from '@src/shared'
import { Model } from 'mongoose'
import { Tab, TabDocument } from './models/tab.model'

@Injectable()
export class TabService extends BaseMongoCrudService<TabDocument> {
  constructor(@InjectModel(Tab.name) private readonly tabModel: Model<TabDocument>) {
    super(tabModel)
  }
}
