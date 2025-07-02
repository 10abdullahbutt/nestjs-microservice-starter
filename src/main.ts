import { INestMicroservice } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { config } from 'dotenv'
import { join } from 'path'
import { AppModule } from './app.module'
import { GrpcHealthCheckService } from './modules/health/grpc-health.service'

async function main(): Promise<any> {
  config()
  const app: INestMicroservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.HOST}:${process.env.PORT}`,
      package: 'tab',
      protoPath: join(__dirname, '../_proto/tab.proto'),
      loader: {
        keepCase: true,
        enums: String,
        oneofs: true,
        arrays: true
      }
    }
  })

  app.get(GrpcHealthCheckService).setStatus('UserService', 'SERVING')

  return await app.listen()
}

process.on('unhandledRejection', (error) => console.error('Users Service unhandledRejection =>>', error))
process.on('uncaughtException', (error) => console.error('Users Service  uncaughtException =>>', error))

main()
