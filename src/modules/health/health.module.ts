import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcHealthCheckService } from './grpc-health.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  exports: [GrpcHealthCheckService],
  providers: [GrpcHealthCheckService],
})
export class HealthModule {}
