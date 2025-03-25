import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WorkerService } from '../services/worker.service';
import { FetchDataRequestDto } from '../dto/fetch-data-request.dto';
import { FetchDataResponseDto } from '../dto/fetch-data-response.dto';

@Controller()
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Post('/fetch')
  @ApiOperation({
    summary: 'Manually trigger a Probation data fetch with date boundaries',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns fetch data response',
    type: FetchDataResponseDto,
  })
  initiateDataFetch(
    @Body() fetchDataDto: FetchDataRequestDto,
  ): FetchDataResponseDto {
    return this.workerService.triggerFetchData(fetchDataDto);
  }
}
