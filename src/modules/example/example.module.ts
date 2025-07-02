import { Module } from '@nestjs/common';
import { getMongoSchema } from '@src/shared';
import { Example, ExampleSchema } from './models';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
  imports: [getMongoSchema(Example.name, ExampleSchema)],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [],
})
export class ExampleModule {}
