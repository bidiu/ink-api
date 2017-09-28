const appConfg = require('./app.json');


if (process.env.INK_ENV) {
    appConfg.env = process.env.INK_ENV;
}


module.exports = appConfg;
