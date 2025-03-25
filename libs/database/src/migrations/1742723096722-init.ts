import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1742723096722 implements MigrationInterface {
  name = 'Init1742723096722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await queryRunner.query(
      `CREATE TABLE campaign_reports (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            campaign CHARACTER VARYING NOT NULL,
            campaign_id CHARACTER VARYING NOT NULL,
            adgroup CHARACTER VARYING NOT NULL,
            adgroup_id CHARACTER VARYING NOT NULL,
            ad CHARACTER VARYING NOT NULL,
            ad_id CHARACTER VARYING NOT NULL,
            client_id CHARACTER VARYING NOT NULL,
            event_name CHARACTER VARYING NOT NULL,
            event_time TIMESTAMP NOT NULL,
            event_date CHARACTER VARYING NOT NULL,
            error_message CHARACTER VARYING,
            created_at TIMESTAMP NOT NULL DEFAULT now(),
            updated_at TIMESTAMP NOT NULL DEFAULT now(),
          
            CONSTRAINT unique_event UNIQUE (event_time, client_id, event_name)
        )`,
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_campaign_reports_ad_id ON campaign_reports (ad_id)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE campaign_reports`);
  }
}
