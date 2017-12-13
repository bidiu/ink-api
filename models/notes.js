const Sequalize = require('sequelize');
const sequelize = require('../db/db');
const SharingLevel = require('../common/constants').SharingLevel;

const MODEL_NAME = 'note';
const TABLE_NAME = 'notes';

const MODEL_DEF = {
    id: {
        type: Sequalize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        validate: {
            min: 1
        }
    },
    title: {
        type: Sequalize.STRING, 
        allowNull: false, 
        validate: {
            notEmpty: true
        }
    },
    content: {
        type: Sequalize.STRING, 
        allowNull: false
    },
    sharing: {
        type: Sequalize.ENUM(SharingLevel.NOT_SHARING, SharingLevel.ANYONE),
        allowNull: false,
        defaultValue: SharingLevel.NOT_SHARING
    },
    private: {
        type: Sequalize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

const Note = sequelize.define(MODEL_NAME, MODEL_DEF, {
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
Note.hiddenFields = ['createdAt', 'updatedAt', 'deletedAt'];
// foreign keys
Note.referenceFields = ['sectionId'];
Note.ownerFields = ['owner'];
Note.readonlyFields = ['_endpoint'];
// all fields (including foreign keys, except for readonly fields)
Note.fields = Object.keys(MODEL_DEF).concat(Note.hiddenFields, Note.referenceFields, Note.ownerFields);

Note.sharingFields = [ ];
Note.sharable = true;

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
Note.sanitize = function(raw, { toExclude = [], toInclude = Note.fields } = {}) {
    let sanitized = {};
    toInclude = toInclude.filter((field) => {
        return Note.fields.includes(field) && !toExclude.includes(field);
    });
    Object.keys(raw).forEach((field) => {
        if (toInclude.includes(field)) {
            sanitized[field] = raw[field];
        }
    });
    return sanitized;
}

// `referenceFields` is here because `sectionId` is part of the endpoint path
Note.excludeOnCreate = ['id'].concat(Note.hiddenFields, Note.referenceFields, Note.ownerFields);
Note.includeOnCreate = Note.fields.filter((field) => !Note.excludeOnCreate.includes(field));
Note.sanitizeOnCreate = function(received) {
    return Note.sanitize(received, { toExclude: Note.excludeOnCreate });
}

Note.excludeOnUpdate = ['id'].concat(Note.hiddenFields, Note.ownerFields);
Note.includeOnUpdate = Note.fields.filter((field) => !Note.excludeOnUpdate.includes(field));
Note.sanitizeOnUpdate = function(received) {
    return Note.sanitize(received, { toExclude: Note.excludeOnUpdate });
}

Note.excludeOnRetrieve = [ ];
Note.includeOnRetrieve = Note.fields.filter((field) => !Note.excludeOnRetrieve.includes(field));
/**
 * @param retrieved
 * @param toInclude 
 *      An array/'*' (optional):
 *          undefined/'*' means including all fields, while [] means 
 *          including no field at all, {} will be returned then.
 */
Note.sanitizeOnRetrieve = function(retrieved, toInclude) {
    return Note.sanitize(retrieved, {
        toExclude: Note.excludeOnRetrieve, 
        toInclude: toInclude === '*' ? undefined : toInclude
    });
}

module.exports = Note;
