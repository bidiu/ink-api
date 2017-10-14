const User = require('./users');
const Notebook = require('./notebooks');


User.hasMany(Notebook, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
Notebook.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });


// order matters
module.exports = new Map([
    ['users', User],
    ['notebooks', Notebook]
]);
