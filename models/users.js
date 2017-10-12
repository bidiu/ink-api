const Sequalize = require('sequelize');
const sequelize = require('../db/db');


const TABLE_NAME = 'users';

const definition = {
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
    // a random string unknown to users before email validation
    secret: {
        type: Sequalize.STRING, 
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
const User = sequelize.define('user', definition, {
    paranoid: true,
    tableName: TABLE_NAME
});


// hidden fields are those that are never updated with JS code
User.hiddenFields = ['createdAt', 'updatedAt', 'deletedAt'];
// TODO all fields (except for foreign keys)
User.fields = Object.keys(definition).concat(User.hiddenFields);


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
        return User.fields.includes(field) && !toExclude.includes(field);
    });
    Object.keys(raw).forEach((field) => {
        if (toInclude.includes(field)) {
            sanitized[field] = raw[field];
        }
    });
    return sanitized;
}

User.excludeOnCreate = ['id', 'status', 'secret'].concat(User.hiddenFields);
User.sanitizeOnCreate = function(received) {
    return User.sanitize(received, { toExclude: User.excludeOnCreate });
}

User.excludeOnUpdate = ['id', 'username', 'password', 'secret'].concat(User.hiddenFields);
User.sanitizeOnUpdate = function(received) {
    return User.sanitize(received, { toExclude: User.excludeOnUpdate });
}

User.excludeOnRetrieve = ['password', 'secret'];
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
