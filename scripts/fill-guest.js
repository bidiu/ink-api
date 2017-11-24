require('./common');
const userService = require('../services/users.v1');

let guest = {
    email: 'guest@inkbook.io',
    // hardcoded to `guest`
    username: 'guest',
    name: 'Guest',
    password: 'guest1$'
};

userService.create(guest)
        .then((created) => {
            console.log('Guest user was just created: ' + created);
            process.exit(0);
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
