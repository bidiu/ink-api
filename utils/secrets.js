/*
 * a very basic tool for reading docker secret
 */

const fs = require('fs');
const path = require('path');

const SECRET_BASE_DIR = '/run/secrets';

/**
 * It's caller's responsibility to make sure the container is granted to read
 * the secret.
 * 
 * @param {string} name secret's name
 */
const readSecret = (name, { trim = true } = {}) => {
  let secret = fs.readFileSync(path.join(SECRET_BASE_DIR, name), { encoding: 'utf8' });
  if (trim) { secret.trim(); }
  return secret;
};

exports.secretBaseDir = SECRET_BASE_DIR;
exports.readSecret = readSecret;
