const Tag = require('../models/tags');

/**
 * @param {*} name tag name
 */
function retrieveOrCreate(name, { transaction } = {}) {
    return Tag.findOrCreate({
                where: { name },
                defaults: { name },
                transaction
            })
            .then(([ tag ]) => tag);
}

exports.retrieveOrCreate = retrieveOrCreate;
