import { EventName } from '@app/database/constants/campaign-report-event-name';

export class CampaignReportDto {
  ad: string;
  adId: string;
  adgroup: string;
  adgroupId: string;
  campaign: string;
  campaignId: string;
  clientId: string;
  eventName: EventName;
  eventTime: Date;
}
