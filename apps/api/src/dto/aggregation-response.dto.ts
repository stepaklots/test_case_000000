import { ApiProperty } from '@nestjs/swagger';

export class AggregatedEventDto {
  @ApiProperty({
    description: 'Unique identifier of the ad',
    example: '9a8197a9-4ace-4999-a729-b12345ab1a1a',
    type: String,
  })
  adId: string;

  @ApiProperty({
    description: 'Date when the event occurred in ISO format',
    example: '2025-03-25',
    type: String,
  })
  eventDate: string;

  @ApiProperty({
    description: 'Number of events that occurred',
    example: 69,
    type: Number,
  })
  count: number;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Current page (0-based)',
    example: 0,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  take: number;

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 420,
    type: Number,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 42,
    type: Number,
  })
  totalPages: number;
}

export class AggregationResponseDto {
  @ApiProperty({
    description: 'Array of aggregated event data',
    type: AggregatedEventDto,
  })
  items: AggregatedEventDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination: PaginationDto;
}
