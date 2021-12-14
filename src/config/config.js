const fs = require('fs');

module.exports = {
    local: {
        username: 'root',
        password: '100grilo',
        database: 'sgLegis',
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
    },
    development: {
        dialect: 'mysql',
        port: process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
    },
    production: {
        dialect: 'mysql',
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
    }
};