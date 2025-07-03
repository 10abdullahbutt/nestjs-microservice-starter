import { IGetAllDto } from '@src/shared/dto';
import { BaseController, GrpcController, IMongoService } from '../../common';
import { CreateExampleDto } from './dto/index.dto';
import { Example, ExampleDocument } from './models';
import { ExampleService } from './example.service';
import { Controller } from '@nestjs/common';

@Controller('ExampleService')
@GrpcController('ExampleService')
export class ExampleController
  extends BaseController<ExampleDocument>
  implements IMongoService<ExampleDocument, Example>
{
  constructor(private readonly exampleService: ExampleService) {
    super(exampleService);
  }

  getAllExamplesList(params: IGetAllDto) {
    return super.getAll(params);
  }

  create(params: CreateExampleDto) {
    return super.create(params as unknown as ExampleDocument);
  }
}
