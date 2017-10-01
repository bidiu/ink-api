const express = require('express');
const userController = require('../../controllers/users');


const v1Router = express.Router();


/** user resources start */

v1Router.get('/users', (req, res) => {
    userController.list(req, res);
});

/** user resources endt */


module.exports = v1Router;
