const express = require('express');
const v1Router = require('./v1');
const accKeeper = require('../../middleware/auth/acc-tokens');


const apiRouter = express.Router();

// gatekeeper (verify the access_token)
apiRouter.use(accKeeper);

// /api/v1
apiRouter.use('/v1', v1Router);


module.exports = apiRouter;
