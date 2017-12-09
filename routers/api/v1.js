const express = require('express');
const paramValidator = require('../../middleware/params/params');
const userController = require('../../controllers/users.v1');
const notebookController = require('../../controllers/notebooks.v1');
const sectionController = require('../../controllers/sections.v1');


const v1Router = express.Router();

/** --------------- api/v1 global param validators start --------------- */

v1Router.use(
    paramValidator({
        '_where': [{
            validator: 'type',
            type: 'object',
            allowNull: false
        }, {
            validator: 'where'
        }]
    })
);

/** --------------- api/v1 global param validators start --------------- */


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
