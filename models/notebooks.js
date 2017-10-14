const Sequalize = require('sequelize');
const sequelize = require('../db/db');


const MODEL_NAME = 'notebook';
const TABLE_NAME = 'notebooks';

const DEF = {
    id: {
        type: Sequalize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        validate: {
            min: 1
        }
    },
    notebookName: {
        type: Sequalize.STRING, 
        allowNull: false, 
        validate: {
            notEmpty: true
            // TODO
        }
    },
    // following are optional
    icon: {
        type: Sequalize.STRING,
    }
};

const Notebook = sequelize.define(MODEL_NAME, DEF, {
    paranoid: true,
    tableName: TABLE_NAME
});


// hidden fields are those that are never updated with JS code
Notebook.hiddenFields = ['createdAt', 'updatedAt', 'deletedAt'];
// foreign keys
Notebook.referenceFields = ['userId'];
// all fields (including foreign keys)
Notebook.fields = Object.keys(DEF).concat(Notebook.hiddenFields, Notebook.referenceFields);


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
Notebook.sanitize = function(raw, { toExclude = [], toInclude = Notebook.fields } = {}) {
    let sanitized = {};
    toInclude = toInclude.filter((field) => {
        return Notebook.fields.includes(field) && !toExclude.includes(field);
    });
    Object.keys(raw).forEach((field) => {
        if (toInclude.includes(field)) {
            sanitized[field] = raw[field];
        }
    });
    return sanitized;
}

Notebook.excludeOnCreate = ['id'].concat(Notebook.hiddenFields);
Notebook.sanitizeOnCreate = function(received) {
    return Notebook.sanitize(received, { toExclude: Notebook.excludeOnCreate });
}

Notebook.excludeOnUpdate = ['id', 'userId'].concat(Notebook.hiddenFields);
Notebook.sanitizeOnUpdate = function(received) {
    return Notebook.sanitize(received, { toExclude: Notebook.excludeOnUpdate });
}

// TODO foreign keys
Notebook.excludeOnRetrieve = [];
/**
 * @param retrieved
 * @param toInclude 
 *      An array/'*' (optional):
 *          undefined/'*' means including all fields, while [] means 
 *          including no field at all, {} will be returned then.
 */
Notebook.sanitizeOnRetrieve = function(retrieved, toInclude) {
    return Notebook.sanitize(retrieved, {
        toExclude: Notebook.excludeOnRetrieve, 
        toInclude: toInclude === '*' ? undefined : toInclude
    });
}


module.exports = Notebook;
