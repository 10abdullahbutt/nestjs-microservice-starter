import { Injectable } from '@nestjs/common'
import { HealthImplementation } from 'grpc-health-check'

@Injectable()
export class GrpcHealthCheckService extends HealthImplementation {
  constructor() {
    super()

    this.setStatus('UserService', 'SERVING')
  }
}
