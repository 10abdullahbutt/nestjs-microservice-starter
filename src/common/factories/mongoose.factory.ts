import { ConfigService } from '@nestjs/config'
import { Connection } from 'mongoose'

export const getMongooseFactory = () => {
  return () => {
    const configService = new ConfigService()
    return {
      uri: configService.get<string>('DB_URL'),
      retryAttempts: Number.MAX_VALUE,
      retryDelay: 5000,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 25000,
      connectionFactory: (connection: Connection) => {
        if (connection.readyState === 1) {
          console.log('DB connected')
        }
        connection.on('reconnected', () => {
          console.log('DB reconnected')
        })
        connection.on('disconnected', () => {
          console.log('DB disconnected')
        })
        connection.on('error', (error) => {
          console.log('DB connection failed! ', error)
        })
        return connection
      }
    }
  }
}
