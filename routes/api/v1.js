const express = require('express');
const paramValidator = require('../../middleware/params/params');
const userController = require('../../controllers/users.v1');
const notebookController = require('../../controllers/notebooks.v1');
const sectionController = require('../../controllers/sections.v1');
const noteController = require('../../controllers/notes.v1');
const asyncHandler = require('../../middleware/common/async');

const v1Router = express.Router();

/** --------------- api/v1 global param validators start --------------- */

v1Router.use(
    paramValidator({
        '_where': [
            { validator: 'type', type: 'object', allowNull: false },
            { validator: 'where' }
        ],
        '_limit': [
            { validator: 'type', type: 'number', allowNull: false }, 
            { validator: 'range', min: 1, max: 100 }
        ],
        'owner': [{ validator: 'ban' }],
        'createdAt': [{ validator: 'ban' }],
        'updatedAt': [{ validator: 'ban' }],
        'deletedAt': [{ validator: 'ban' }]
    })
);

/** --------------- api/v1 global param validators end --------------- */


/** --------------- user resources start --------------- */

v1Router.get('/users', asyncHandler(userController.index));

v1Router.get('/users/:id(\\d+)', asyncHandler(userController.retrieve));

v1Router.post('/users', asyncHandler(userController.create));

v1Router.patch('/users/:id(\\d+)', asyncHandler(userController.update));

v1Router.delete('/users/:id(\\d+)', asyncHandler(userController.destroy));

/** --------------- user resources end --------------- */


/** --------------- notebook resources start --------------- */

v1Router.get('/users/:userId(\\d+)/notebooks', asyncHandler(notebookController.index));

v1Router.get('/notebooks/:notebookId(\\d+)', asyncHandler(notebookController.retrieve));

v1Router.post('/notebooks', 
    paramValidator({
        'userId': [{ validator: 'ban' }]
    }),
    asyncHandler(notebookController.create)
);

v1Router.patch('/notebooks/:notebookId(\\d+)', 
    paramValidator({
        'userId': [{ validator: 'ban' }]
    }),
    asyncHandler(notebookController.update)
);

v1Router.delete('/notebooks/:notebookId(\\d+)', asyncHandler(notebookController.destroy));

/** --------------- notebook resources end --------------- */


/** --------------- section resources start --------------- */

v1Router.get('/notebooks/:notebookId(\\d+)/sections', asyncHandler(sectionController.index));

v1Router.get('/sections/:sectionId(\\d+)', asyncHandler(sectionController.retrieve));

v1Router.post('/notebooks/:notebookId(\\d+)/sections', 
    paramValidator({
        'notebookId': [{ validator: 'ban' }]
    }),
    asyncHandler(sectionController.create)
);

v1Router.patch('/sections/:sectionId(\\d+)',
    paramValidator({
        'notebookId': [
            { validator: 'type', type: 'number', allowNull: false },
            { validator: 'owner', model: 'notebooks' }
        ]
    }),
    asyncHandler(sectionController.update)
);

v1Router.delete('/sections/:sectionId(\\d+)', asyncHandler(sectionController.destroy));

/** --------------- section resources end --------------- */


/** --------------- note resources start --------------- */

v1Router.get('/notes', asyncHandler(noteController.index));

v1Router.get('/notes/:noteId(\\d+)', asyncHandler(noteController.retrieve));

v1Router.post('/sections/:sectionId(\\d+)/notes', 
    paramValidator({
        'sectionId': [{ validator: 'ban' }]
    }),
    asyncHandler(noteController.create)
);

v1Router.patch('/notes/:noteId(\\d+)', 
    paramValidator({
        'sectionId': [
            { validator: 'type', type: 'number', allowNull: false },
            { validator: 'owner', model: 'sections' }
        ]
    }),
    asyncHandler(noteController.update)
);

v1Router.delete('/notes/:noteId(\\d+)', asyncHandler(noteController.destroy));

v1Router.get('/notes/:noteId(\\d+)/tags', asyncHandler(noteController.tagIndex));

v1Router.put('/notes/:noteId(\\d+)/tags',
    paramValidator({
        'names': [{ validator: 'array', required: true, elType: 'string' }]
    }),
    asyncHandler(noteController.tagReplace)
);

v1Router.patch('/notes/:noteId(\\d+)/tags', 
    paramValidator({
        'names': [{ validator: 'array', required: true, elType: 'string' }]
    }),
    asyncHandler(noteController.tagUpdate)
);

v1Router.delete('/notes/:noteId(\\d+)/tags/:tag', asyncHandler(noteController.tagDestroy));

/** --------------- note resources end --------------- */


module.exports = v1Router;
