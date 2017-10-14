const express = require('express');
const userController = require('../../controllers/users.v1');
const notebookController = require('../../controllers/notebooks.v1');


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

/** user resources end */


/** notebook resources start */

v1Router.get('/users/:userId/notebooks', (req, res, next) => {
    notebookController.index(req, res, next);
});
v1Router.get('/notebooks', (req, res, next) => {
    notebookController.index(req, res, next);
})

v1Router.get('/users/:userId/notebooks/:notebookId', (req, res, next) => {
    notebookController.retrieve(req, res, next);
});
v1Router.get('/notebooks/:notebookId', (req, res, next) => {
    notebookController.retrieve(req, res, next);
});

v1Router.post('/users/:userId/notebooks', (req, res, next) => {
    notebookController.create(req, res, next);
});
// TODO POST /notebooks (need auth middleware in the future)

v1Router.patch('/users/:userId/notebooks/:notebookId', (req, res, next) => {
    notebookController.update(req, res, next);
});
v1Router.patch('/notebooks/:notebookId', (req, res, next) => {
    notebookController.update(req, res, next);
});

v1Router.delete('/users/:userId/notebooks/:notebookId', (req, res, next) => {
    notebookController.destroy(req, res, next);
});
v1Router.delete('/notebooks/:notebookId', (req, res, next) => {
    notebookController.destroy(req, res, next);
});

/** notebook resources end */


module.exports = v1Router;
