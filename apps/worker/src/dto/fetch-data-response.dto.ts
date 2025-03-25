import { ApiProperty } from '@nestjs/swagger';

export class FetchDataResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Request successfully queued',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Fetch data start date',
    example: '2025-03-25',
    type: String,
  })
  startDate: string;

  @ApiProperty({
    description: 'Fetch data end date',
    example: '2025-03-25',
    type: String,
  })
  endDate: string;
}
