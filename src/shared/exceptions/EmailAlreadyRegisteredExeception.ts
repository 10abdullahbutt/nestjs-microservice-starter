import { RpcException } from '@nestjs/microservices'

export class EmailAlreadyRegisteredExeception extends RpcException {
  constructor() {
    super('Email already in use.')
  }
}
