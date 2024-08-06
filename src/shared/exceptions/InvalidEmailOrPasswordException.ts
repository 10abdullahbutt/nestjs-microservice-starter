import { RpcException } from '@nestjs/microservices'

export class InvalidEmailOrPasswordException extends RpcException {
  constructor() {
    super('Invalid email or password.')
  }
}
