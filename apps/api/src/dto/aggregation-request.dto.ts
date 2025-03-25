import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventName } from '@app/database/constants/campaign-report-event-name';
import { ApiProperty } from '@nestjs/swagger';

export class AggregationRequestDto {
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

  @ApiProperty({
    name: 'eventName',
    enum: EventName,
    required: true,
    description: 'Type of event to aggregate',
  })
  @IsEnum(EventName)
  eventName: EventName;

  @ApiProperty({
    name: 'take',
    description: 'Number of records to return (page size)',
    required: false,
    example: 10,
    type: Number,
    maximum: 1000,
    default: 10,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @Max(1000)
  take: number = 10;

  @ApiProperty({
    name: 'page',
    description: 'Page number (0-based indexing)',
    required: false,
    example: 0,
    type: Number,
    default: 0,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  page: number = 0;
}
