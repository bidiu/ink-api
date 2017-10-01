const User = require('./users');
const Notebook = require('./notebooks');


User.hasMany(Notebook);
Notebook.belongsTo(User);


// order matters
module.exports = new Map([
    ['users', User],
    ['notebooks', Notebook]
]);
