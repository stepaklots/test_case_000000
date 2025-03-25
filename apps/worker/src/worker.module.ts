import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { WorkerController } from './controllers/worker.controller';
import { WorkerService } from './services/worker.service';
import { WorkerRunnerService } from './services/worker-runner.service';
import { ProbationDataWorker } from './services/probation-data.worker';
import { CommonModule } from '@app/common';
import { CronTaskService } from './tasks/cron-task.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [CommonModule, DatabaseModule, ScheduleModule.forRoot()],
  providers: [
    WorkerService,
    WorkerRunnerService,
    ProbationDataWorker,
    CronTaskService,
  ],
  controllers: [WorkerController],
  exports: [CronTaskService],
})
export class WorkerModule {}
