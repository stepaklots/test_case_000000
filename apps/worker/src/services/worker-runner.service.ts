import { Injectable, Logger } from '@nestjs/common';
import { ProbationDataWorker } from './probation-data.worker';
import { TaskQueue } from '../queue/task.queue';
import { FetchDataResult } from '../dto/fetch-data-result';
import { FetchDataParams } from '../dto/fetch-data-params';

@Injectable()
export class WorkerRunnerService {
  private readonly logger = new Logger(WorkerRunnerService.name);
  private readonly taskQueue: TaskQueue<FetchDataParams, FetchDataResult>;

  constructor(workerService: ProbationDataWorker) {
    this.taskQueue = new TaskQueue(workerService, {
      concurrency: 1,
      enableLogging: true,
    });
    this.taskQueue.start();
  }

  queueWork(params: FetchDataParams): boolean {
    return this.taskQueue.enqueue({
      params,
      onSuccess: (result: FetchDataResult) => {
        this.logger.log(
          `Successfully finished fetch request for request: ${JSON.stringify(result)}`,
        );
      },
      onError: (error: Error) => {
        this.logger.error('Failed to perform fetch request', error.message);
      },
    });
  }
}
