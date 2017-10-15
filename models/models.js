const User = require('./users');
const Notebook = require('./notebooks');


User.hasMany(Notebook, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Notebook.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });


/**
 * Get the 'include' object for the option parameter of 'findAll'.
 * TODO count, next page url
 * 
 * @param options
 *      expand          true means to expand
 *      expLimit        number limit of expanded association models
 */
User.getExpandDef = function({ expand = false, expLimit = 20 } = {}) {
    let def = [];
    for (let association of [Notebook]) {
        def.push({
            model: association,
            attributes: expand ? association.includeOnRetrieve : ['id'],
            limit: expLimit,
            separate: false
        });
    }
    return def;
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
    for (let association of [User]) {
        def.push({
            model: association,
            attributes: expand ? association.includeOnRetrieve : ['id'],
            limit: expLimit,
            separate: false
        });
    }
    return def;
}


// order matters
module.exports = new Map([
    ['users', User],
    ['notebooks', Notebook]
]);
