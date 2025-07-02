import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseMongoCrudService } from '@src/common';
import { Model } from 'mongoose';
import { Example, ExampleDocument } from './models/example.model';

@Injectable()
export class ExampleService extends BaseMongoCrudService<ExampleDocument> {
  constructor(@InjectModel(Example.name) private readonly exampleModel: Model<ExampleDocument>) {
    super(exampleModel);
  }
}
