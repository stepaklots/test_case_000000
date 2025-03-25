import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventName } from '../constants/campaign-report-event-name';

@Entity('campaign_reports')
export class CampaignReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'campaign' })
  campaign: string;

  @Column({ name: 'campaign_id' })
  campaignId: string;

  @Column({ name: 'adgroup' })
  adgroup: string;

  @Column({ name: 'adgroup_id' })
  adgroupId: string;

  @Column({ name: 'ad' })
  ad: string;

  @Column({ name: 'ad_id' })
  adId: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @Column({ name: 'event_name', type: 'varchar' })
  eventName: EventName;

  @Column({ name: 'event_time' })
  eventTime: Date;

  @Column({ name: 'event_date' })
  eventDate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(args?: Partial<CampaignReportEntity>) {
    Object.assign(this, args);
  }
}
