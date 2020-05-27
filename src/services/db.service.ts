import { conn } from '@/database/connection';

export class DbService {
  public async getLastCampaignNumber() {
    const [rows] = await conn.query(
      'SELECT campaign_number FROM users LIMIT 1',
    );

    return rows;
  }
}
