import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignReportsAggregationService } from '../services/campaign-report-aggregation.service';
import { AggregationRequestDto } from '../dto/aggregation-request.dto';
import { AggregationResponseDto } from '../dto/aggregation-response.dto';

@ApiTags('campaign-reports-aggregation')
@Controller('campaign-reports')
export class CampaignReportsAggregationController {
  constructor(
    private readonly aggregationService: CampaignReportsAggregationService,
  ) {}

  @Get('/aggregate')
  @ApiOperation({ summary: 'Get aggregated event counts by ad_id and date' })
  @ApiResponse({
    status: 200,
    description: 'Returns aggregated events data',
    type: AggregationResponseDto,
  })
  get(@Query() params: AggregationRequestDto): Promise<AggregationResponseDto> {
    return this.aggregationService.getData(params);
  }
}
