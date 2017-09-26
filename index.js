const http = require('http');
const express = require('express');

const app = express();

app.use((req, res) => {
	res.end('You\'ll make it.\nNever say never.');
});

http.createServer(app).listen(3000);

