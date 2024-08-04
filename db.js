const { createPool } = require('mysql2/promise');
const { config } = require('dotenv');

config();

const pool = createPool({
    host: process.env.MYSQLDB_HOST,
    user: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_ROOT_PASSWORD,
    port: process.env.MYSQLDB_DOCKER_PORT,
    database: process.env.MYSQLDB_NAME
});

module.exports = pool;