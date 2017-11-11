const http = require('http');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const queryParser = require('./middleware/queries/query-parser');
const paramsValidator = require('./middleware/params/params-validator');
const modelMap = require('./models/models');
const authRouter = require('./routers/auth/auth');
const apiRouter = require('./routers/api/api');
const notFoundHandler = require('./middleware/errors/not-found');
const inkErrorHandler = require('./middleware/errors/ink-errors');
const sequelizeErrorHandler = require('./middleware/errors/sequelize-errors');
const errorHandler = require('./middleware/errors/errors');
const appConfig = require('./config/app.config');


const app = express();


// load global middleware
app.use(logger('dev'));
if (appConfig.env === 'dev') { app.use(cors()); }
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(queryParser);
app.use(paramsValidator);

// load routers
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// 404 handler
app.use(notFoundHandler);

// error handlers
app.use(inkErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);


// create the api server itself and listen
http.createServer(app).listen(3000);
