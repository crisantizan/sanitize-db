import { conn } from '@/database/connection';

export class DbService {
  public async getLastCampaignNumber() {
    const [rows] = await conn.query(
      'SELECT campaign_number FROM users LIMIT 1',
    );

    return rows;
  }

  /** save records */
  public async save(users: any[]) {
    const columns = Object.keys(users[0]).join(', ');
    const values = users.map(u => Object.values(u));

    const [rows] = await conn.query(`INSERT INTO users (${columns}) VALUES ?`, [
      values,
    ]);

    return rows;
  }
}
