const Sequalize = require('sequelize');
const sequelize = require('../db/db');


const Notebook = sequelize.define('notebook', {
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
            notNull: true,
            notEmpty: true
            // TODO
        }
    },
    // following are optional
    icon: {
        type: Sequalize.STRING,
    }
}, {
    paranoid: true,
    tableName: 'notebooks'
});


module.exports = Notebook;
