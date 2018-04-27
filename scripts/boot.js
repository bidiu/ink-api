/**
 * Logic that will be executed when bootstrapping this app.
 * Note that it will be exexcuted in main thread, so do not block.
 */

const userService = require('../services/users.v1');
const InkError = require('../common/models/ink-errors');
const execScript = require('../utils/common').execScript;

const GUEST_USERNAME = require('../common/constants').GUEST_USERNAME;

userService.retrieveV2({ username: GUEST_USERNAME })
    .catch((err) => {
        if (err instanceof InkError.NotFound) {
            execScript('fill-guest');
        }
    });
