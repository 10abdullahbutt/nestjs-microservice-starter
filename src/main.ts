import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { json as expressJson, urlencoded as expressUrlEncoded } from 'express'
import basicAuth from 'express-basic-auth'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { swaggerConfig } from './shared/config'

async function main(): Promise<any> {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter())

  const config = app.get(ConfigService)
  const PORT = config.get<number>('PORT') || 5001

  app.enableCors({ credentials: true, origin: '*' })

  app.use(helmet())
  app.enableCors()
  app.use(cookieParser())

  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true, transform: false, whitelist: true }))

  app.setGlobalPrefix('api/v1')

  // if (['staging', 'production', 'dev'].includes(configService.get<string>('NODE_ENV'))) {
  app.use(['/docs', '/docs-json', '/api-docs'], basicAuth({ challenge: true, users: { [config.get<string>('SWAGGER_USER')]: config.get<string>('SWAGGER_PASSWORD') } }))
  // }

  // extending request size for image uploading in post/patch APIs
  app.use(expressJson({ limit: '50mb' }))
  app.use(expressUrlEncoded({ limit: '50mb', extended: true }))

  swaggerConfig(app)

  const logger = new Logger('main')
  logger.log(`Application listening on port ${PORT}`)

  await app.listen(PORT)
}

process.on('unhandledRejection', (error) => console.error('Users Service unhandledRejection =>>', error))
process.on('uncaughtException', (error) => console.error('Users Service  uncaughtException =>>', error))

main()
