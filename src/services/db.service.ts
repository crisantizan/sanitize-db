import { conn } from '@/database/connection';
import { OkPacket } from 'mysql2';

export class DbService {
  public async getLastCampaignNumber() {
    const [rows] = await conn.query(
      'SELECT campaign_number FROM users LIMIT 1',
    );

    return !!(rows as Array<any>).length
      ? (rows as Array<any>)[0].campaign_number
      : 0;
  }

  /** save records */
  public async save(users: any[]) {
    const columns = Object.keys(users[0]).join(', ');
    const values = users.map(u => Object.values(u));

    const [rows] = await conn.query(`INSERT INTO users (${columns}) VALUES ?`, [
      values,
    ]);

    return rows as OkPacket;
  }
}
