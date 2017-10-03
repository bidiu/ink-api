const Sequalize = require('sequelize');
const sequelize = require('../db/db');


// sequlize will convert 'user' to 'users' table
const User = sequelize.define('user', {
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
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: Sequalize.STRING, 
        allowNull: false, 
        unique: true,
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
}, {
    paranoid: true,
    tableName: 'users'
});


User.fields = [
    'id', 'email', 'username', 'password', 'name', 'status', 'secret', 
    'sex', 'city', 'province', 'country', 'hobbies', 'bio', 'birthday', 
    'avatarUrl', 'homeUrl'
];

User.sanitize = function(query, exclude) {
    let sanitized = {};
    Object.keys(query).forEach((field) => {
        if (User.fields.includes(field) && !exclude.includes(field)) {
            sanitized[field] = query[field];
        }
    });
    return sanitized;
}

User.sanitizeOnCreate = function(query) {
    return User.sanitize(query, ['id', 'status', 'secret']);
}

User.sanitizeOnUpdate = function(query) {
    return User.sanitize(query, ['secret']);
}

User.sanitizeOnRetrieve = function(retrieved) {
    return User.sanitize(retrieved, ['password', 'secret']);
}


module.exports = User;
