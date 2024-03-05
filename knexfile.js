module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.MYSQLDB_HOST || 'mysqldb',
        user: process.env.MYSQLDB_USER || 'root',
        password: process.env.MYSQLDB_ROOT_PASSWORD || '123456',
        database: process.env.MYSQLDB_NAME || 'paidb',
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './migrations',
    }
}