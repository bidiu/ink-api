const Sequalize = require('sequelize');
const sequelize = require('../db/db');
const User = require('./users');


const MODEL_NAME = 'notebook';
const TABLE_NAME = 'notebooks';
const ASSOCIATIONS = [User];

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
Notebook.includeOnCreate = Notebook.fields.filter((field) => !Notebook.excludeOnCreate.includes(field));
Notebook.sanitizeOnCreate = function(received) {
    return Notebook.sanitize(received, { toExclude: Notebook.excludeOnCreate });
}

Notebook.excludeOnUpdate = ['id', 'userId'].concat(Notebook.hiddenFields);
Notebook.includeOnUpdate = Notebook.fields.filter((field) => !Notebook.excludeOnUpdate.includes(field));
Notebook.sanitizeOnUpdate = function(received) {
    return Notebook.sanitize(received, { toExclude: Notebook.excludeOnUpdate });
}

Notebook.excludeOnRetrieve = [].concat(Notebook.referenceFields);
Notebook.includeOnRetrieve = Notebook.fields.filter((field) => !Notebook.excludeOnCreate.includes(field));
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


/**
 * Get the 'include' object for the option parameter of 'findAll'.
 * TODO count, next page url
 * 
 * @param options
 *      expand        true means to expand
 *      expandLimit   number limit of expanded association models
 */
Notebook.getExpandDef = function({ expand = false, expLimit = 20 } = {}) {
    let def = [];
    for (let association of ASSOCIATIONS) {
        def.push({
            model: association,
            attributes: expand ? association.includeOnRetrieve : ['id'],
            limit: expLimit,
            separate: false
        });
    }
    return def;
}


module.exports = Notebook;
