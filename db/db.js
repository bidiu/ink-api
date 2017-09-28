const Sequelize = require('sequelize');
const dbConfig = require('../config/db.json');


const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
});


module.exports = sequelize;
