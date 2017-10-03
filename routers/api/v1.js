const express = require('express');
const userController = require('../../controllers/users.v1');


const v1Router = express.Router();


/** user resources start */

v1Router.get('/users', (req, res, next) => {
    userController.index(req, res, next);
});

v1Router.get('/users/:id', (req, res, next) => {
    userController.retrieve(req, res, next);
});

v1Router.post('/users', (req, res, next) => {
    userController.create(req, res, next);
});

v1Router.patch('/users/:id', (req, res, next) => {
    userController.update(req, res, next);
});

v1Router.delete('/users/:id', (req, res, next) => {
    userController.destroy(req, res, next);
});

/** user resources endt */


module.exports = v1Router;
