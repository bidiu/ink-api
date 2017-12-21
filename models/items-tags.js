const Sequalize = require('sequelize');
const sequelize = require('../db/db');

const MODEL_NAME = 'itemTag';
const TABLE_NAME = 'items_tags';

const DEF = {
    id: {
        type: Sequalize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    itemType: {
        type: Sequalize.STRING,
        allowNull: false,
        unique: 'itemType_itemId_tagId',
        validate: {
            notEmpty: true
        }
    },
    itemId: {
        type: Sequalize.INTEGER,
        allowNull: false,
        unique: 'itemType_itemId_tagId',
        references: null
    },
    tagId: {
        type: Sequalize.INTEGER,
        allowNull: false,
        unique: 'itemType_itemId_tagId'
    }
};

const ItemTag = sequelize.define(MODEL_NAME, DEF, {
    paranoid: false,
    tableName: TABLE_NAME
});

// hidden fields are those that are never updated with JS code
ItemTag.hiddenFields = ['createdAt', 'updatedAt'];
// foreign keys
ItemTag.referenceFields = [];
ItemTag.readonlyFields = [];
// all fields (including foreign keys, except for readonly fields)
ItemTag.fields = Object.keys(DEF).concat(ItemTag.hiddenFields, ItemTag.referenceFields);

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
ItemTag.sanitize = function(raw, { toExclude = [], toInclude = ItemTag.fields } = {}) {
    let sanitized = {};
    toInclude = toInclude.filter((field) => {
        return ItemTag.fields.includes(field) && !toExclude.includes(field);
    });
    Object.keys(raw).forEach((field) => {
        if (toInclude.includes(field)) {
            sanitized[field] = raw[field];
        }
    });
    return sanitized;
}

ItemTag.excludeOnCreate = ['id'].concat(ItemTag.hiddenFields);
ItemTag.includeOnCreate = ItemTag.fields.filter((field) => !ItemTag.excludeOnCreate.includes(field));
ItemTag.sanitizeOnCreate = function(received) {
    return ItemTag.sanitize(received, { toExclude: ItemTag.excludeOnCreate });
}

ItemTag.excludeOnUpdate = ['id', 'itemType', 'itemId', 'tagId'].concat(ItemTag.hiddenFields);
ItemTag.includeOnUpdate = ItemTag.fields.filter((field) => !ItemTag.excludeOnUpdate.includes(field));
ItemTag.sanitizeOnUpdate = function(received) {
    return ItemTag.sanitize(received, { toExclude: ItemTag.excludeOnUpdate });
}

ItemTag.excludeOnRetrieve = [];
ItemTag.includeOnRetrieve = ItemTag.fields.filter((field) => !ItemTag.excludeOnRetrieve.includes(field));
/**
 * @param retrieved
 * @param toInclude 
 *      An array/'*' (optional):
 *          undefined/'*' means including all fields, while [] means 
 *          including no field at all, {} will be returned then.
 */
ItemTag.sanitizeOnRetrieve = function(retrieved, toInclude) {
    return ItemTag.sanitize(retrieved, {
        toExclude: ItemTag.excludeOnRetrieve, 
        toInclude: toInclude === '*' ? undefined : toInclude
    });
}

module.exports = ItemTag;
