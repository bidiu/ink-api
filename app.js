const http = require('http');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const queryParser = require('./middleware/queries/query-parser');
const modelMap = require('./models/models');
const authRouter = require('./routers/auth/auth');
const apiRouter = require('./routers/api/api');
const notFoundHandler = require('./middleware/errors/not-found');
const inkErrorHandler = require('./middleware/errors/ink-errors');
const sequelizeErrorHandler = require('./middleware/errors/sequelize-errors');
const errorHandler = require('./middleware/errors/errors');
const appConfig = require('./config/app.config');

const app = express();

const corsOptions = {
    origin: 'http://localhost:4200',
    // some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    // passing cookies, auth headers
    credentials: true
}

// load global middleware
app.use(logger('dev'));
if (appConfig.env === 'dev') { app.use(cors(corsOptions)); }
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(queryParser);

// load routers
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// 404 handler
app.use(notFoundHandler);

// error handlers
app.use(inkErrorHandler);
app.use(sequelizeErrorHandler);
app.use(errorHandler);

// execute some bootstrap logic
require('./scripts/boot');

// create the api server itself and listen
http.createServer(app).listen(3000);
