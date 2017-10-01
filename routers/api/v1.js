const express = require('express');
const userController = require('../../controllers/users.v1');


const v1Router = express.Router();


/** user resources start */

v1Router.get('/users', (req, res) => {
    userController.index(req, res);
});

v1Router.get('/users/:id', (req, res) => {
    userController.retrieve(req, res);
});

v1Router.post('/users', (req, res) => {
    userController.create(req, res);
});

v1Router.patch('/users/:id', (req, res) => {
    userController.update(req, res);
});

v1Router.delete('/users/:id', (req, res) => {
    userController.destroy(req, res);
});

/** user resources endt */


module.exports = v1Router;
