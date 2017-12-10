const Sequalize = require('sequelize');
const sequelize = require('../db/db');
const SharingLevel = require('../common/constants').SharingLevel;


// cannot be easily changed given current design
const MODEL_NAME = 'user';
const TABLE_NAME = 'users';

const DEF = {
    id: {
        type: Sequalize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        validate: {
            min: 1
        }
    },
    email: { 
        type: Sequalize.STRING,
        allowNull: false, 
        unique: {
            msg: 'The given email is already registered.'
        },
        validate: {
            isEmail: true
        }
    },
    username: {
        type: Sequalize.STRING, 
        allowNull: false, 
        unique: {
            msg: 'The given username is already used by another user.'
        },
        validate: {
            notEmpty: true
            // TODO
        }
    },
    password: {
        type: Sequalize.STRING, 
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    salt: {
        type: Sequalize.STRING, 
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: Sequalize.STRING, 
        allowNull: false,
        validate: {
            notEmpty: true,
            isAlphanumeric: true
        }
    },
    status: {
        type: Sequalize.ENUM('new', 'valid'),
        defaultValue: 'new'
    },
    sharing: {
        type: Sequalize.ENUM(SharingLevel.NOT_SHARING, SharingLevel.USERS_ONLY, SharingLevel.ANYONE),
        allowNull: false,
        defaultValue: SharingLevel.NOT_SHARING
    },
    private: {
        type: Sequalize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    // following are optional
    sex: { type: Sequalize.ENUM('m', 'f') },
    city: { type: Sequalize.STRING },
    province: { type: Sequalize.STRING },
    country: { type: Sequalize.STRING },
    hobbies: { type: Sequalize.STRING },
    bio: { type: Sequalize.STRING },
    birthday: { type: Sequalize.DATEONLY },
    avatarUrl: {
        type: Sequalize.STRING,
        validate: {
            isUrl: true
        }
    },
    homeUrl: {
        type: Sequalize.STRING,
        validate: {
            isUrl: true
        }
    }
};

// sequlize will convert 'user' to 'users' table
const User = sequelize.define(MODEL_NAME, DEF, {
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
User.hiddenFields = ['createdAt', 'updatedAt', 'deletedAt'];
User.referenceFields = [];
User.readonlyFields = ['_endpoint'];
// all fields (including foreign keys, except for readonly fields)
User.fields = Object.keys(DEF).concat(User.hiddenFields, User.referenceFields);

/**
 * The sharing fields that the user could decide share or not
 * with others by setting the `sharing` field.
 * 
 * Note that this is like a filter (blacklist) that take 
 * effect **after** the `retrival/indexing` sanitization.
 * 
 * Different from `private`, `sharing` gives the user a more
 * granular control over the specific fields (but what these 
 * fields are cannot be configured by the user). On the other 
 * hand, `private` with true will restrain the access of the 
 * resource to only the owner.
 */
User.sharingFields = [ 'email' ];
/**
 * User is a sharable resource (a user can view another user's 
 * profile).
 * 
 * Note that only sharable resources need to have `sharing` and 
 * `private` fields, as well as `Model.sharingfields`.
 */
User.sharable = true;


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
User.sanitize = function(raw, { toExclude = [], toInclude = User.fields } = {}) {
    let sanitized = {};
    toInclude = toInclude.filter((field) => {
        return !toExclude.includes(field);
    });
    Object.keys(raw).forEach((field) => {
        if (toInclude.includes(field)) {
            sanitized[field] = raw[field];
        }
    });
    return sanitized;
}

User.excludeOnCreate = ['id', 'status', 'salt'].concat(User.hiddenFields);
User.includeOnCreate = User.fields.filter((field) => !User.excludeOnCreate.includes(field));
User.sanitizeOnCreate = function(received) {
    return User.sanitize(received, { toExclude: User.excludeOnCreate });
}

User.excludeOnUpdate = ['id', 'username', 'salt'].concat(User.hiddenFields);
User.includeOnUpdate = User.fields.filter((field) => !User.excludeOnUpdate.includes(field));
User.sanitizeOnUpdate = function(received) {
    return User.sanitize(received, {
        toExclude: User.excludeOnUpdate, 
        toInclude: ['oldPassword'].concat(User.fields)
    });
}

User.excludeOnRetrieve = ['password', 'salt'].concat(User.referenceFields);
User.includeOnRetrieve = User.fields.filter((field) => !User.excludeOnRetrieve.includes(field));
/**
 * @param retrieved
 * @param toInclude 
 *      An array/'*' (optional):
 *          undefined/'*' means including all fields, while [] means 
 *          including no field at all, {} will be returned then.
 */
User.sanitizeOnRetrieve = function(retrieved, toInclude) {
    return User.sanitize(retrieved, {
        toExclude: User.excludeOnRetrieve, 
        toInclude: toInclude === '*' ? undefined : toInclude
    });
}

module.exports = User;
