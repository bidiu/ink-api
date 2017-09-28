const http = require('http');
const express = require('express');

const app = express();

app.use((req, res) => {
	// res.end('You\'ll make it.');
	debug(req, res);
});

http.createServer(app).listen(3000);


// TODO only for debug
function debug(req, res) {
	const db = require('./db/db.js');
	db.authenticate()
			.then(() => {
				res.end('Connect to database successfully.');
			})
			.catch((err) => {
				res.end('Cannot connect to database.\n\n' + err);
			});
}