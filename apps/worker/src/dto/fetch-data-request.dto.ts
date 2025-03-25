import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class FetchDataRequestDto {
  @ApiProperty({
    name: 'startDate',
    type: String,
    example: '2025-01-01',
    required: true,
    description: 'Start date in YYYY-MM-DD format',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    name: 'endDate',
    type: String,
    example: '2025-01-31',
    required: true,
    description: 'End date in YYYY-MM-DD format',
  })
  @IsDateString()
  endDate: string;
}
