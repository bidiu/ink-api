const Sequalize = require('sequelize');
const sequelize = require('../db/db');

const MODEL_NAME = 'section';
const TABLE_NAME = 'sections';

const MODEL_DEF = {
    id: {
        type: Sequalize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        validate: {
            min: 1
        }
    },
    sectionName: {
        type: Sequalize.STRING, 
        allowNull: false, 
        validate: {
            notEmpty: true
            // TODO
        }
    },
    // owner field
    owner: {
        type: Sequalize.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
};

const Section = sequelize.define(MODEL_NAME, MODEL_DEF, {
    getterMethods: {
        // readonly
        _endpoint() {
            return `/${TABLE_NAME}/${this.getDataValue('id')}`;
        }
    },
    paranoid: true,
    tableName: TABLE_NAME
});

// hidden fields are those that are never updated with JS code
Section.hiddenFields = ['createdAt', 'updatedAt', 'deletedAt'];
// foreign keys
Section.referenceFields = ['notebookId'];
Section.ownerFields = ['owner'];
Section.readonlyFields = ['_endpoint'];
// all fields (including foreign keys, except for readonly fields)
Section.fields = Object.keys(MODEL_DEF).concat(Section.hiddenFields, Section.referenceFields, Section.ownerFields);

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
Section.sanitize = function(raw, { toExclude = [], toInclude = Section.fields } = {}) {
    let sanitized = {};
    toInclude = toInclude.filter((field) => {
        return Section.fields.includes(field) && !toExclude.includes(field);
    });
    Object.keys(raw).forEach((field) => {
        if (toInclude.includes(field)) {
            sanitized[field] = raw[field];
        }
    });
    return sanitized;
}

Section.excludeOnCreate = ['id'].concat(Section.hiddenFields, Section.ownerFields);
Section.includeOnCreate = Section.fields.filter((field) => !Section.excludeOnCreate.includes(field));
Section.sanitizeOnCreate = function(received) {
    return Section.sanitize(received, { toExclude: Section.excludeOnCreate });
}

Section.excludeOnUpdate = ['id'].concat(Section.hiddenFields, Section.ownerFields);
Section.includeOnUpdate = Section.fields.filter((field) => !Section.excludeOnUpdate.includes(field));
Section.sanitizeOnUpdate = function(received) {
    return Section.sanitize(received, { toExclude: Section.excludeOnUpdate });
}

Section.excludeOnRetrieve = [ ];
Section.includeOnRetrieve = Section.fields.filter((field) => !Section.excludeOnRetrieve.includes(field));
/**
 * @param retrieved
 * @param toInclude 
 *      An array/'*' (optional):
 *          undefined/'*' means including all fields, while [] means 
 *          including no field at all, {} will be returned then.
 */
Section.sanitizeOnRetrieve = function(retrieved, toInclude) {
    return Section.sanitize(retrieved, {
        toExclude: Section.excludeOnRetrieve, 
        toInclude: toInclude === '*' ? undefined : toInclude
    });
}

module.exports = Section;
