const appConfig = require('./app.json');


if (process.env.INK_ENV) {
    appConfig.env = process.env.INK_ENV;
}
appConfig.dbConfig = require('./db.json')[appConfig.env];


module.exports = appConfig;
