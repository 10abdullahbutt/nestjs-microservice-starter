import { RedisModule } from '@liaoliaots/nestjs-redis'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { getIORedisFactory, getMongooseFactory } from '@src/shared'
import { CustomConfigModule } from './config.module'
import { HttpExceptionFilter } from './common/exception-filter'
import { LoggerMiddleware } from './common/middlewares'
import { ExampleModule } from './modules/example/example.module'
import { HealthModule } from './modules/health'

@Module({
  imports: [CustomConfigModule, RedisModule.forRoot(getIORedisFactory()), MongooseModule.forRootAsync({ useFactory: getMongooseFactory() }), ExampleModule, HealthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
