import { Observable } from 'rxjs';

/**
 * Interface for worker that processes work requests
 */
export interface Worker<T, R> {
  run(params: T): Observable<R>;
}
