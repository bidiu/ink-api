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


User.fields = Object.keys(definition);

User.sanitize = function(received, exclude) {
    let sanitized = {};
    Object.keys(received).forEach((field) => {
        if (User.fields.includes(field) && !exclude.includes(field)) {
            sanitized[field] = received[field];
        }
    });
    return sanitized;
}

User.sanitizeOnCreate = function(received) {
    return User.sanitize(received, ['id', 'status', 'secret']);
}

// TODO deleteAt...
User.sanitizeOnUpdate = function(received) {
    return User.sanitize(received, ['secret']);
}

User.sanitizeOnRetrieve = function(retrieved) {
    return User.sanitize(retrieved, ['password', 'secret']);
}


module.exports = User;
