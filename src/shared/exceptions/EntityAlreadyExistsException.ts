import { RpcException } from '@nestjs/microservices'

export class EntityAlreadyExistsException extends RpcException {
  constructor() {
    super('Entity already exists.')
  }
}
