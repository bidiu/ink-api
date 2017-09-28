const Sequelize = require('sequelize');
const appConfig = require('../config/app.config');
const dbConfig = appConfig.dbConfig;


const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
});


module.exports = sequelize;
