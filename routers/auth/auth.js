const express = require('express');
const asyncHandler = require('../../middleware/common/async');
const authController = require('../../controllers/auth');

const authRouter = express.Router();

/**
 * log in (or as guest) - acquire a new access_token and several refresh_tokens
 */
authRouter.post('/tokens', asyncHandler(authController.create));

/**
 * refresh access_tokens with refresh_token
 */
authRouter.patch('/tokens', asyncHandler(authController.update));

/**
 * log out (delete all tokens)
 */
authRouter.delete('/tokens', asyncHandler(authController.destroy));

module.exports = authRouter;
