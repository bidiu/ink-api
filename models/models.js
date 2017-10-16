const User = require('./users');
const Notebook = require('./notebooks');


let modelMap = new Map([
    ['users', User],
    ['notebooks', Notebook]
]);


User.hasMany(Notebook, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Notebook.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });


const DEFAULT_USER_EXP = {
    notebooks: { _limit: 12, _strip: false }
};

/**
 * Get the 'include' object for the option parameter of 'findAll'.
 */
User.getExpandDef = function({ _expand: expand = {} } = {}) {
    let def = [];

    // notebooks
    if (expand.notebooks) {
        let exp = Object.assign({}, DEFAULT_USER_EXP.notebooks, expand.notebooks);
        def.push({
            model: Notebook,
            // have to explicitly specifiy foreign key here
            attributes: exp._strip ? ['id', 'userId'] : ['userId'].concat(Notebook.includeOnRetrieve),
            // null means expand all notebooks (no limit)
            limit: exp._limit || undefined,
            order: [ exp._strip ? ['id', 'DESC'] : ['createdAt', 'DESC'] ],
            separate: true
        });
    }

    return def;
};


const DEFAULT_NOTEBOOK_EXP = {
    users: { _limit: 1, _strip: false }
};

/**
 * Get the 'include' object for the option parameter of 'findAll'.
 * TODO count, next page url, order
 * 
 * @param options
 *      expand        true means to expand
 *      expandLimit   number limit of expanded association models, some
 *                    particular expand type will ignore this (for example, 
 *                    tags of a note).
 */
Notebook.getExpandDef = function({ _expand: expand = {} } = {}) {
    let def = [];

    // users
    if (expand.users) {
        let exp = Object.assign({}, DEFAULT_NOTEBOOK_EXP.users, expand.users);
        def.push({
            model: User,
            attributes: exp._strip ? ['id'] : User.includeOnRetrieve,
            // no need for limit and order
            separate: false
        });
    }

    return def;
};


// order matters
module.exports = modelMap;
