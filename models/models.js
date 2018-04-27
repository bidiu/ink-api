const User = require('./users');
const Notebook = require('./notebooks');
const Section = require('./sections');
const Note = require('./notes');
const Tag = require('./tags');
const ItemTag = require('./items-tags');

// no need to be in model map
const NotebookCount = Notebook.NotebookCount;

let modelMap = new Map([
    ['users', User],
    ['notebooks', Notebook],
    ['sections', Section],
    ['notes', Note],
    ['tags', Tag],
    ['items_tags', ItemTag]
]);


User.hasMany(Notebook, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Notebook.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

NotebookCount.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

Notebook.hasMany(Section, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Section.belongsTo(Notebook, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

Section.hasMany(Note, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Note.belongsTo(Section, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

Note.belongsToMany(Tag, {
    through: {
        model: ItemTag,
        unique: false,
        scope: { itemType: 'note' }
    },
    foreignKey: 'itemId',
    constraints: false
});
Tag.belongsToMany(Note, {
    through: {
        model: ItemTag,
        unique: false
    },
    foreignKey: 'tagId',
    constraints: false
});


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
    users: { _limit: 1, _strip: false }, // `_limit` will not be used
    sections: { _strip: false }
};

/**
 * Get the 'include' object for the option parameter of 'findAll'.
 * 
 * Right now expand feature is not fully supported; it will be implemented
 * one by one for each model when needed.
 * 
 * Won't implement limit/count.
 * 
 * TODO handle removed sections
 * 
 * @param options
 *      expand        true means to expand (or a expand option object)
 *      expandLimit   number limit of expanded association models, some
 *                    particular expand type will ignore this (for example, 
 *                    tags of a note). (deprecated!)
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

    // sections
    if (expand.sections) {
        let exp = Object.assign({}, DEFAULT_NOTEBOOK_EXP.sections, expand.sections);
        def.push({
            model: Section,
            attributes: exp._strip ? ['id', 'notebookId'] : Section.includeOnRetrieve,
            separate: true
        });
    }

    return def;
};


// order matters
module.exports = modelMap;
