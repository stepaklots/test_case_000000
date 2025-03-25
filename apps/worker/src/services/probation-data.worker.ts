import { Injectable, Logger } from '@nestjs/common';
import {
  bufferCount,
  catchError,
  concatMap,
  from,
  map,
  Observable,
  of,
  reduce,
} from 'rxjs';
import { EventName } from '@app/database/constants/campaign-report-event-name';
import { ProbationApiClient } from '@app/common/clients/probation-api.client';
import { ProbationDataDto } from '@app/common/dto/probation-data.dto';
import { FetchDataParams } from '../dto/fetch-data-params';
import { FetchDataResult } from '../dto/fetch-data-result';
import { Worker } from '../queue/worker';
import { CampaignReportService } from '@app/database/services/campaign-report.service';
import { CampaignReportDto } from '@app/database/dto/campaign-report.dto';

@Injectable()
export class ProbationDataWorker
  implements Worker<FetchDataParams, FetchDataResult>
{
  private readonly logger = new Logger(ProbationDataWorker.name);
  private readonly batchSize = 100;

  constructor(
    private readonly campaignReportService: CampaignReportService,
    private readonly probationApiClient: ProbationApiClient,
  ) {}

  /**
   * Fetch and process data from Probation API
   */
  run(params: FetchDataParams): Observable<FetchDataResult> {
    this.logger.log(
      `Starting to fetch and process data from ${params.startDate.toString()} to ${params.endDate.toString()}`,
    );

    return this.probationApiClient
      .streamData(params.startDate, params.endDate)
      .pipe(
        bufferCount(this.batchSize),
        concatMap((batch) => this.processBatch(batch)),
        reduce((acc, one) => acc + one, 0),
        map((count): FetchDataResult => {
          return {
            params,
            recordsAdded: count,
          };
        }),
      );
  }

  /**
   * Process a batch of Probation data items
   */
  private processBatch(items: ProbationDataDto[]): Observable<number> {
    this.logger.debug(`Processing batch of ${items.length} items`);

    try {
      const entities = items.map((item) => this.mapToCampaignReportDto(item));

      return from(this.campaignReportService.saveAll(entities)).pipe(
        catchError((error: Error) => {
          this.logger.error(`Error processing batch: ${error.message}`);
          return of(0);
        }),
      );
    } catch (error) {
      this.logger.error(`Error mapping batch: ${error}`);
      return of(0);
    }
  }

  /**
   * Map Probation data to Campaign Report entity
   */
  private mapToCampaignReportDto(data: ProbationDataDto): CampaignReportDto {
    const report = new CampaignReportDto();
    report.campaign = data.campaign;
    report.campaignId = data.campaign_id;
    report.adgroup = data.adgroup;
    report.adgroupId = data.adgroup_id;
    report.ad = data.ad;
    report.adId = data.ad_id;
    report.clientId = data.client_id;
    report.eventName = data.event_name as EventName;
    report.eventTime = new Date(data.event_time);
    return report;
  }
}
