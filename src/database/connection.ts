// get the client
import mysql from 'mysql2';

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test-database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const conn = pool.promise();

export function testConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection(err => {
      if (err) {
        reject(err);
      }

      resolve(true);
    });
  });
}
