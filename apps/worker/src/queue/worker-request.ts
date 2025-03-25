/**
 * Interface for work requests
 */
export interface WorkRequest<T, R> {
  params: T;
  onSuccess?: (result: R) => void;
  onError?: (error: any) => void;
}
