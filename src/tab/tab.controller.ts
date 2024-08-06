import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { IGetAllDto } from '@src/shared/dto'
import { BaseController, IMongoService } from '../shared'
import { CreateTabDto } from './dto/index.dto'
import { Tab, TabDocument } from './models'
import { TabService } from './tab.service'

@ApiTags('Tab')
@Controller('tab')
@ApiBearerAuth()
export class TabController extends BaseController<TabDocument> implements IMongoService<TabDocument, Tab> {
  constructor(private readonly tabService: TabService) {
    super(tabService)
  }

  @Get()
  getAllTabsList(@Query() params: IGetAllDto) {
    return super.getAll(params)
  }

  @Post()
  create(@Body() params: CreateTabDto) {
    return super.create(params as unknown as TabDocument)
  }
}
