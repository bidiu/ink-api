const fs = require('fs');


function readKey(filename) {
    try {
        let content = fs.readFileSync(filename, { encoding: 'utf8' });
        return content.replace(/-+.+-+/gi, '')
                .replace(/\s/gi, '');
    } catch (e) {
        console.error('Failed to read public/private keys, abort.');
        console.error('> Details: ');
        console.error(e);
        process.exit(1);
    }
}


exports.readPublicKey = function(filename) {
    return readKey(filename);
};

exports.readPrivateKey = function(filename) {
    return readKey(filename);
}
