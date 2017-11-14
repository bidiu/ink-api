const path = require('path');
const pemUtils = require('../utils/pem');
const appConfig = require('./app.json');


if (process.env.INK_ENV) {
    appConfig.env = process.env.INK_ENV;
}

// load auth config
let authConfig = require('./auth.config');
appConfig.authConfig = authConfig;

// prepare public/private keys
appConfig.publicKey = pemUtils.readPublicKey(path.join(__dirname, 'keys', authConfig.pubKeyFile));
appConfig.privateKey = pemUtils.readPrivateKey(path.join(__dirname, 'keys', authConfig.privKeyFile));
authConfig.publicKey = appConfig.publicKey;
authConfig.privateKey = appConfig.privateKey;

// load db config
appConfig.dbConfig = require('./db.json')[appConfig.env];


module.exports = appConfig;
