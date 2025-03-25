import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { format } from 'date-fns';
import { CampaignReportEntity } from '../entities/campaign-report.entity';
import { CampaignReportDto } from '../dto/campaign-report.dto';
import { CampaignReportAggregationParams } from '../dto/campaign-report-aggregation-params';
import {
  AdIdCount,
  CampaignReportsAggregationResult,
} from '../dto/campaign-report-aggregation-result';

@Injectable()
export class CampaignReportService {
  private readonly logger = new Logger(CampaignReportService.name);

  constructor(
    @InjectRepository(CampaignReportEntity)
    private campaignReportRepository: Repository<CampaignReportEntity>,
  ) {}

  /**
   * Saves all reports. Ignore duplicates
   * @param reports
   * @return count - number of entities saved
   */
  async saveAll(reports: CampaignReportDto[]): Promise<number> {
    const entities = reports.map((report) => {
      const entity = new CampaignReportEntity(report);
      entity.eventDate = format(report.eventTime, 'yyyy-MM-dd');
      return entity;
    });

    const insertResult = await this.campaignReportRepository
      .createQueryBuilder()
      .insert()
      .into(CampaignReportEntity)
      .values(entities)
      .orIgnore()
      .execute();
    const rawCount = (insertResult.raw as object[]).length;
    return Promise.resolve(rawCount);
  }

  async aggregateBy(
    params: CampaignReportAggregationParams,
  ): Promise<CampaignReportsAggregationResult> {
    try {
      const { fromDate, toDate, eventName, page, take } = params;

      const dataQuery = this.campaignReportRepository
        .createQueryBuilder('report')
        .select('report.ad_id', 'adId')
        .addSelect('report.event_date', 'eventDate')
        .addSelect('COUNT(report.id)', 'count')
        .where('report.event_time >= :fromDate', { fromDate })
        .andWhere('report.event_time <= :toDate', { toDate })
        .andWhere('report.event_name = :eventName', { eventName })
        .groupBy('report.ad_id')
        .addGroupBy('report.event_date')
        .orderBy('report.event_date', 'DESC')
        .take(take)
        .skip(page * take);
      const aggregatedData = await dataQuery.getRawMany();
      const data = aggregatedData as AdIdCount[];
      const total = await this.runCountQuery(eventName, fromDate, toDate);

      return {
        data,
        total,
      };
    } catch (error) {
      this.logger.error(`Error getting aggregated event counts: ${error}`);
      throw error;
    }
  }

  private async runCountQuery(eventName: string, fromDate: Date, toDate: Date) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const countResult: { total: string }[] =
      await this.campaignReportRepository.query(
        'SELECT COUNT(*) as total FROM ' +
          '(SELECT ad_id, event_date FROM campaign_reports ' +
          'WHERE event_name = $1 ' +
          'AND event_time >= $2 ' +
          'AND event_time <= $3 ' +
          'GROUP BY ad_id, event_date' +
          ') as aggregated_data',
        [eventName, fromDate, toDate],
      );
    return parseInt(countResult[0].total, 10);
  }
}
