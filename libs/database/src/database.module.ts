import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignReportEntity } from '@app/database/entities/campaign-report.entity';
import { CampaignReportService } from '@app/database/services/campaign-report.service';
import { dataSourceOptions } from '@app/database/data-source';
import { ConfigModule } from '@app/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...dataSourceOptions,
      }),
    }),
    TypeOrmModule.forFeature([CampaignReportEntity]),
  ],
  providers: [CampaignReportService],
  exports: [CampaignReportService],
})
export class DatabaseModule {}
