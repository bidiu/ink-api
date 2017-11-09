const fs = require('fs');


function readKey(filename) {
    try {
        return fs.readFileSync(filename, { encoding: 'utf8' });
    } catch (e) {
        console.error('Failed to read public/private keys, abort.');
        console.error('Details: \n' + e);
        process.exit(1);
    }
}


exports.readPublicKey = function(filename) {
    return readKey(filename);
};

exports.readPrivateKey = function(filename) {
    return readKey(filename);
}
