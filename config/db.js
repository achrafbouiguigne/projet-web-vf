const { Pool } = require('pg');

const pool = new Pool({
  user: 'achraf',
  host: 'localhost',
  database: 'login',
  password: 'achraftaha2004',
  port: 5432,
});

module.exports = pool;
