import { Module } from '@nestjs/common';
import { ProbationApiClient } from '@app/common/clients/probation-api.client';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@app/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [ProbationApiClient],
  exports: [ProbationApiClient],
})
export class CommonModule {}
