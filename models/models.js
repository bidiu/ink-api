const User = require('./users');
const Notebook = require('./notebooks');


User.hasMany(Notebook, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Notebook.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });


/**
 * Get the 'include' object for the option parameter of 'findAll'.
 * TODO count, next page url, order
 * 
 * @param options
 *      expand          true means to expand
 *      expLimit        number limit of expanded association models
 *      expOrder        TODO
 */
User.getExpandDef = function({ expand = false, expLimit = 12, expOrder } = {}) {
    let def = [];
    // one user has many notebooks
    def.push({
        model: Notebook,
        // have to explicitly specifiy foreign key here
        attributes: expand ? ['userId'].concat(Notebook.includeOnRetrieve) : ['id', 'userId'],
        limit: expLimit,
        order: [ expand ? ['createdAt', 'DESC'] : ['id', 'DESC'] ],
        separate: true
    });
    return def;
}

/**
 * Get the 'include' object for the option parameter of 'findAll'.
 * TODO count, next page url, order
 * 
 * @param options
 *      expand        true means to expand
 *      expandLimit   number limit of expanded association models
 */
Notebook.getExpandDef = function({ expand = false, expLimit = 12 } = {}) {
    let def = [];
    def.push({
        model: User,
        attributes: expand ? User.includeOnRetrieve : ['id'],
        // belongsTo doesn't need limit/order
        separate: false
    });
    return def;
}


// order matters
module.exports = new Map([
    ['users', User],
    ['notebooks', Notebook]
]);
