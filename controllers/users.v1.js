const User = require('../models/users');
const Ack = require('../common/ack');
const Err = require('../common/err');


/**
 * GET /users
 */
exports.index = function(req, res, next) {
    res.end('index');
}

/**
 * GET /users/1
 */
exports.retrieve = function(req, res, next) {
    res.end('retrieve');
}

/**
 * POST /users      (non-idempotent)
 * 
 * create a new user
 * 
 * additional params:
 *      _return = true/false        (return the created user or not)
 */
exports.create = function(req, res, next) {
    let received = User.sanitizeOnCreate(req.body);
    let user = User.build(received);

    user.save().then((saved) => {
        let ack = new Ack(200, 'User was created successfully.');
        if (req.body._return) {
            ack.data = User.sanitizeOnRetrieve(saved.get({ plain: true }));
        }
        res.status(ack.status).json(ack);
    }, (err) => {
        next(new Err(400, err));
    }).catch((err) => {
        next(err);
    });
}

/**
 * PATCH /users/1   (idempotent)
 * 
 * update a existing user (could be partially update)
 */
exports.update = function(req, res, next) {
    res.end('update');
}

/**
 * DELETE /users/1  (idempotent)
 */
exports.destroy = function(req, res, next) {
    res.end('destroy');
}
