import { BadRequestException, Injectable } from '@nestjs/common';
import { CampaignReportService } from '@app/database/services/campaign-report.service';
import { AggregationRequestDto } from '../dto/aggregation-request.dto';
import { AggregationResponseDto } from '../dto/aggregation-response.dto';
import { CampaignReportsAggregationResult } from '@app/database/dto/campaign-report-aggregation-result';

@Injectable()
export class CampaignReportsAggregationService {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  async getData(params: AggregationRequestDto): Promise<AggregationResponseDto> {
    const { fromDate, toDate } = this.validate(params);

    const result = await this.campaignReportService.aggregateBy({
      fromDate,
      toDate,
      eventName: params.eventName,
      take: params.take,
      page: params.page,
    });

    return this.mapToPage(result, params.take, params.page);
  }

  private validate(params: AggregationRequestDto) {
    const fromDate = new Date(params.startDate);
    const toDate = new Date(params.endDate);

    if (fromDate > toDate) {
      throw new BadRequestException('From date must be before to date');
    }
    return { fromDate, toDate };
  }

  private mapToPage(
    result: CampaignReportsAggregationResult,
    take: number,
    page: number,
  ): AggregationResponseDto {
    const totalPages = Math.ceil(result.total / take);
    return {
      items: result.data,
      pagination: {
        take,
        page,
        totalPages,
        totalItems: result.total,
      },
    };
  }
}
