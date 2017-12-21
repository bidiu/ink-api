const Sequalize = require('sequelize');
const sequelize = require('../db/db');

const MODEL_NAME = 'tag';
const TABLE_NAME = 'tags';

const DEF = {
    name: {
        type: Sequalize.STRING, 
        primaryKey: true, 
        validate: {
            notEmpty: true
        }
    }
};

const Tag = sequelize.define(MODEL_NAME, DEF, {
    paranoid: true,
    tableName: TABLE_NAME
});

// hidden fields are those that are never updated with JS code
Tag.hiddenFields = ['createdAt', 'updatedAt', 'deletedAt'];
// foreign keys
Tag.referenceFields = [];
Tag.readonlyFields = [];
// all fields (including foreign keys, except for readonly fields)
Tag.fields = Object.keys(DEF).concat(Tag.hiddenFields, Tag.referenceFields);

/**
 * Notes:
 *      1. If a field is present both in 'toExclude' and 'toInclude', 
 *         'toExclude' will take precedence.
 *      2. This method is a little dangerous (might expose secret info 
 *         to outside if used wrongly, for example). So, instead, you'd 
 *         better call functions after this one.
 * @return
 *      A new sanitized object ('raw' will not be changed)
 */
Tag.sanitize = function(raw, { toExclude = [], toInclude = Tag.fields } = {}) {
    let sanitized = {};
    toInclude = toInclude.filter((field) => {
        return Tag.fields.includes(field) && !toExclude.includes(field);
    });
    Object.keys(raw).forEach((field) => {
        if (toInclude.includes(field)) {
            sanitized[field] = raw[field];
        }
    });
    return sanitized;
}

Tag.excludeOnCreate = [].concat(Tag.hiddenFields);
Tag.includeOnCreate = Tag.fields.filter((field) => !Tag.excludeOnCreate.includes(field));
Tag.sanitizeOnCreate = function(received) {
    return Tag.sanitize(received, { toExclude: Tag.excludeOnCreate });
}

Tag.excludeOnUpdate = ['name'].concat(Tag.hiddenFields);
Tag.includeOnUpdate = Tag.fields.filter((field) => !Tag.excludeOnUpdate.includes(field));
Tag.sanitizeOnUpdate = function(received) {
    return Tag.sanitize(received, { toExclude: Tag.excludeOnUpdate });
}

Tag.excludeOnRetrieve = [];
Tag.includeOnRetrieve = Tag.fields.filter((field) => !Tag.excludeOnRetrieve.includes(field));
/**
 * @param retrieved
 * @param toInclude 
 *      An array/'*' (optional):
 *          undefined/'*' means including all fields, while [] means 
 *          including no field at all, {} will be returned then.
 */
Tag.sanitizeOnRetrieve = function(retrieved, toInclude) {
    return Tag.sanitize(retrieved, {
        toExclude: Tag.excludeOnRetrieve, 
        toInclude: toInclude === '*' ? undefined : toInclude
    });
}

module.exports = Tag;
