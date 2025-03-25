import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { startOfDay } from 'date-fns';
import { WorkerRunnerService } from '../services/worker-runner.service';

@Injectable()
export class CronTaskService {
  private readonly logger = new Logger(CronTaskService.name);

  constructor(private readonly workerRunner: WorkerRunnerService) {
    this.logger.log('Starting CronTaskService');
  }

  /**
   * Trigger a data fetch from Probation API every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  triggerProbationDataFetch(): void {
    this.logger.log('Triggering scheduled Probation data fetch');

    const now = new Date();
    const startDate = startOfDay(now);
    const endDate = now;

    this.workerRunner.queueWork({
      startDate,
      endDate,
      isScheduled: true,
    });
  }
}
