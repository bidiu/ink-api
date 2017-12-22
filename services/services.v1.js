const userService = require('./users.v1');
const notebookService = require('./notebooks.v1');
const sectionService = require('./sections.v1');
const noteService = require('./notes.v1');
const tagService = require('./tags.v1');
// for security concern, auth serivce is not included here

// service map
module.exports = new Map([
    ['users', userService],
    ['notebooks', notebookService],
    ['sections', sectionService],
    ['notes', noteService],
    ['tags', tagService]
]);
