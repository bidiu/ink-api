require('./common');
const userService = require('../services/users.v1');
const GUEST_USERNAME = require('../common/constants').GUEST_USERNAME;

let guest = {
    email: 'guest@inkbook.io',
    // hardcoded to `guest`
    username: GUEST_USERNAME,
    name: 'Guest',
    password: 'guest1$'
};

userService.create(guest)
        .then((created) => {
            process.exit(0);
        })
        .catch((err) => {
            process.exit(1);
        });

// TODO all tables should be in an transaction
