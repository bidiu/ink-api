const express = require('express');
const authController = require('../../controllers/auth');


const authRouter = express.Router();

/**
 * log in (or as guest) - acquire a new access_token and several refresh_tokens
 */
authRouter.post('/tokens', (req, res, next) => {
    authController.create(req, res, next);
});

/**
 * refresh access_tokens with refresh_token
 */
authRouter.patch('/tokens', (req, res, next) => {
    authController.update(req, res, next);
});


module.exports = authRouter;
