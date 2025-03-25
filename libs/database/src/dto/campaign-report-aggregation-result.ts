export interface AdIdCount {
  adId: string;
  eventDate: string;
  count: number;
}

export interface CampaignReportsAggregationResult {
  data: AdIdCount[];
  total: number;
}
