import { Module } from '@nestjs/common'
import { getMongoSchema } from '@src/shared'
import { Tab, TabSchema } from './models'
import { TabController } from './tab.controller'
import { TabService } from './tab.service'

@Module({
  imports: [getMongoSchema(Tab.name, TabSchema)],
  controllers: [TabController],
  providers: [TabService],
  exports: []
})
export class TabModule {}
