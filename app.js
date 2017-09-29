const http = require('http');
const express = require('express');

const app = express();

app.use((req, res) => {
	// res.end('You\'ll make it.\n');
	debug(req, res);
});

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
