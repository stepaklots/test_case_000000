import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkerRunnerService } from './worker-runner.service';
import { FetchDataRequestDto } from '../dto/fetch-data-request.dto';
import { FetchDataResponseDto } from '../dto/fetch-data-response.dto';

@Injectable()
export class WorkerService {
  constructor(private readonly workerRunnerService: WorkerRunnerService) {}

  triggerFetchData(req: FetchDataRequestDto): FetchDataResponseDto {
    try {
      const startDate = new Date(req.startDate);
      const endDate = new Date(req.endDate);

      this.validate(startDate, endDate);

      this.workerRunnerService.queueWork({
        startDate,
        endDate,
        isScheduled: false,
      });

      return {
        message: 'Data fetch queued successfully',
        startDate: startDate.toString(),
        endDate: endDate.toString(),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to initiate data fetch: ${error}`);
    }
  }

  private validate(startDate: Date, endDate: Date) {
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const maxRangeDays = 30;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > maxRangeDays) {
      throw new BadRequestException(
        `Date range cannot exceed ${maxRangeDays} days`,
      );
    }
  }
}
