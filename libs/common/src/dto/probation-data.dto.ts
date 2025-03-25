export interface ProbationDataDto {
  ad: string;
  ad_id: string;
  adgroup: string;
  adgroup_id: string;
  campaign: string;
  campaign_id: string;
  client_id: string;
  event_name: string;
  event_time: string;
}

export interface ProbationResponseDto {
  timestamp: number;
  data: {
    csv: string;
    pagination: { next: string } | null;
  };
}

export interface ParsedProbationResponse {
  records: ProbationDataDto[];
  nextPageUrl: string | null;
}
