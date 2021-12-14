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
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: 'mysql',
    },
    production: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: 'mysql',
    }
};