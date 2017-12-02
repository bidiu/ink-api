const express = require('express');
const userController = require('../../controllers/users.v1');
const notebookController = require('../../controllers/notebooks.v1');
const sectionController = require('../../controllers/sections.v1');


const v1Router = express.Router();


/** --------------- user resources start --------------- */

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

/** --------------- user resources end --------------- */


/** --------------- notebook resources start --------------- */

v1Router.get('/users/:userId/notebooks', (req, res, next) => {
    notebookController.index(req, res, next);
});
/**
 * Index notebooks across user is an dangerous operation, so it won't be granted
 * to any user so far. Later, a `timeline` resources will be added. And also, a 
 * post-filter (still need design here) will be added as well.
 * 
 * Goals:
 *      1. To control what rows are sharable
 *      2. To control what columns are sharable
 */
v1Router.get('/notebooks', (req, res, next) => {
    notebookController.index(req, res, next);
})

v1Router.get('/notebooks/:notebookId', (req, res, next) => {
    notebookController.retrieve(req, res, next);
});

v1Router.post('/notebooks', (req, res, next) => {
    notebookController.create(req, res, next);
});

v1Router.patch('/notebooks/:notebookId', (req, res, next) => {
    notebookController.update(req, res, next);
});

v1Router.delete('/notebooks/:notebookId', (req, res, next) => {
    notebookController.destroy(req, res, next);
});

/** --------------- notebook resources end --------------- */


/** --------------- section resources start --------------- */

v1Router.get('/notebooks/:notebookId/sections', (req, res, next) => {
    sectionController.index(req, res, next);
});

v1Router.get('/sections/:sectionId', (req, res, next) => {
    sectionController.retrieve(req, res, next);
});

v1Router.post('/notebooks/:notebookId/sections', (req, res, next) => {
    sectionController.create(req, res, next);
});

v1Router.patch('/sections/:sectionId', (req, res, next) => {
    sectionController.update(req, res, next);
});

v1Router.delete('/sections/:sectionId', (req, res, next) => {
    sectionController.destroy(req, res, next);
});

/** --------------- section resources start --------------- */


module.exports = v1Router;
