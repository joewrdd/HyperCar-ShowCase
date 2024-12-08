const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

var pool;

const initDB = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    try {
      await pool.getConnection();
      console.log(`Connected to ${process.env.DB_NAME}`);
    } catch (error) {
      console.error(`Unable to connect to database ${error}`);
      process.exit(1);
    } 
  } 
  return pool; 
};

module.exports = { initDB };