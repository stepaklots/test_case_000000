import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CampaignReportsAggregationController } from './controllers/campaign-report-aggregation.controller';
import { CampaignReportsAggregationService } from './services/campaign-report-aggregation.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule, DatabaseModule],
  controllers: [CampaignReportsAggregationController],
  providers: [CampaignReportsAggregationService],
})
export class ApiModule {}
