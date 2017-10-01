const http = require('http');
const express = require('express');
const apiRouter = require('./routers/api/api');

const app = express();


// load routers
app.use('/api', apiRouter);


// create the api server itself
http.createServer(app).listen(3000);


// TODO only for debug
function debug(req, res) {
	const sequelize = require('./db/db');
	sequelize.authenticate()
			.then(() => {
				res.end('Connect to database successfully.\n');
			})
			.catch((err) => {
				res.end(`Cannot connect to database:\n${err}\n`);
			});
}
