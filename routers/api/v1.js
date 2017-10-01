const express = require('express');


const v1Router = express.Router();

v1Router.use(debug);


// TODO only for debug
function debug(req, res, next) {
    res.end(req.originalUrl);
}


module.exports = v1Router;
