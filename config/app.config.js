const path = require('path');
const pemUtils = require('../utils/pem');
const appConfig = require('./app.json');
const readSecret = require('../utils/secrets').readSecret;

const SECRET_BASE_DIR = require('../utils/secrets').secretBaseDir;

if (process.env.INK_API_ENV) {
    appConfig.env = process.env.INK_API_ENV;
}

// load auth config
let authConfig = require('./auth.config');
appConfig.authConfig = authConfig;

// prepare public/private keys
appConfig.publicKey = pemUtils.readPublicKey(path.join(SECRET_BASE_DIR, authConfig.pubKeyFile));
appConfig.privateKey = pemUtils.readPrivateKey(path.join(SECRET_BASE_DIR, authConfig.privKeyFile));
authConfig.publicKey = appConfig.publicKey;
authConfig.privateKey = appConfig.privateKey;

// load db config
appConfig.dbConfig = require('./db.json')[appConfig.env];
// TODO generalize this part when I have time
// load db passwd from docker secret
appConfig.dbConfig.password = readSecret('ink_db_passwd');

module.exports = appConfig;
