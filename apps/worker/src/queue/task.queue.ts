import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, concatMap, filter, mergeMap, tap } from 'rxjs/operators';
import { WorkRequest } from './worker-request';
import { Worker } from './worker';

/**
 * Task Queue with duplicate detection and configurable parallelization
 */
export class TaskQueue<T, R> {
  private requestSubject = new Subject<WorkRequest<T, R>>();
  private activeJobs = new Set<string>();
  private queue$: Observable<any>;
  private isRunning = false;

  /**
   * Create a new TaskQueue
   * @param worker The worker instance that will process tasks
   * @param options Configuration options
   */
  constructor(
    private worker: Worker<T, R>,
    private options: {
      concurrency?: number;
      enableLogging?: boolean;
    } = {},
  ) {
    this.options.concurrency = this.options.concurrency || 1;
    this.options.enableLogging =
      this.options.enableLogging !== undefined
        ? this.options.enableLogging
        : true;

    this.setupQueue();
  }

  /**
   * Set up the queue processing pipeline
   */
  private setupQueue(): void {
    const concurrencyOperator =
      this.options.concurrency === 1
        ? concatMap
        : (workFn: any) => mergeMap(workFn, this.options.concurrency);

    this.queue$ = this.requestSubject.pipe(
      filter((request) => {
        const paramsHash = this.getRequestHash(request);
        if (this.activeJobs.has(paramsHash)) {
          this.log(`Discarded duplicate request: ${paramsHash}`);
          return false;
        }
        return true;
      }),

      concurrencyOperator((request: WorkRequest<T, R>) => {
        const paramsHash = this.getRequestHash(request);

        this.activeJobs.add(paramsHash);
        this.log(`Starting job with params hash: ${paramsHash}`);

        return this.worker.run(request.params).pipe(
          tap({
            next: (result) => {
              this.log(`Job completed successfully: ${paramsHash}`);
              if (request.onSuccess) {
                request.onSuccess(result);
              }
            },
            error: (error) => {
              this.log(`Job failed: ${paramsHash}`, 'error');
              if (request.onError) {
                request.onError(error);
              }
            },
            complete: () => {
              this.activeJobs.delete(paramsHash);
            },
          }),
          catchError(() => {
            this.activeJobs.delete(paramsHash);
            return EMPTY;
          }),
        );
      }),
    );
  }

  private getRequestHash(request: WorkRequest<T, R>): string {
    return JSON.stringify(request);
  }

  /**
   * Start the queue processing
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.log('Starting task queue');
    this.isRunning = true;
    this.queue$.subscribe();
  }

  /**
   * Enqueue a work request
   * @param request The work request to enqueue
   * @returns A boolean indicating if the request was queued (false if duplicate)
   */
  enqueue(request: WorkRequest<T, R>): boolean {
    if (!this.isRunning) {
      this.start();
    }

    const paramsHash = this.getRequestHash(request);

    // Check for duplicates
    if (this.activeJobs.has(paramsHash)) {
      this.log(`Rejected duplicate request: ${paramsHash}`);
      return false;
    }

    this.log(`Queuing request with params hash: ${paramsHash}`);
    this.requestSubject.next(request);
    return true;
  }

  /**
   * Get the current number of active jobs
   */
  getActiveCount(): number {
    return this.activeJobs.size;
  }

  /**
   * Shutdown the queue
   */
  shutdown(): void {
    this.log('Shutting down task queue');
    this.requestSubject.complete();
    this.isRunning = false;
  }

  /**
   * Conditionally log messages based on enableLogging setting
   */
  private log(message: string, level: 'log' | 'error' = 'log'): void {
    if (this.options.enableLogging) {
      if (level === 'error') {
        console.error(`[TaskQueue] ${message}`);
      } else {
        console.log(`[TaskQueue] ${message}`);
      }
    }
  }
}
