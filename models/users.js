const Sequalize = require('sequelize');
const sequelize = require('../db/db');


// sequlize will convert 'user' to 'users' table
const User = sequelize.define('user', {
    userId: {
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
            notNull: true,
            notEmpty: true
            // TODO
        }
    },
    password: {
        type: Sequalize.STRING, 
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    name: {
        type: Sequalize.STRING, 
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            isAlphanumeric: true
        }
    },
    // following are optional
    sex: { type: Sequalize.ENUM('m', 'f') },
    city: { type: Sequalize.STRING },
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
});


module.exports = User;
