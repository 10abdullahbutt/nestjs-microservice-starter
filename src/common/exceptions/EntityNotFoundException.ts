import { RpcException } from '@nestjs/microservices';

export class EntityNotFoundException extends RpcException {
  constructor(module?: string) {
    super(`${module ?? 'Entity'} Not Found`);
  }
}
