require('dotenv').config()

import express from 'express';
import { AddressInfo } from "net";
import * as path from 'path';
import cookieparser = require('cookie-parser');

const bodyParser = require('body-parser');
const debug = require('debug')('my express app');
const app = express();
const cors = require('cors');

// view engine setup
app.set('views', path.join(__dirname, '../views'));

app.set('view engine', 'pug');

app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

// Enable cors

var corsOptions = {
    // origin: ["https://toptech-autoworks-logger.netlify.app", "http://localhost:5000", "https://autoworks-logger-api.netlify.app, https://autoworks-api.up.railway.app/api/authz/login"],
    origin: ["http://localhost:5000"],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With',  'Accept', 'Content-Type', 'Authorization', "access-control-allow-credentials"],
    methods: ['GET', 'POST', 'DELETE']
  }
app.use(cors(corsOptions));

// route imports

import indexRoute from './routes/index';
import initRoute from './routes/init';

// TOOD: Put all routes here
// route calls

// Initializer is restricted to dev environment for security.
if (app.get('env') === 'development') {
    app.use('/api/init', initRoute);
}
// app.use('/api/authz', authzRoutes);
// app.use('/api/vehicle', vehicleRoutes);
// app.use('/api/order', orderRoutes);
// app.use('/api/customer', customerRoutes);
// app.use('/api', enumRoutes);
// app.use('/', indexRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err[ 'status' ] = 404;
    next(err);
});


// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
        res.status(err[ 'status' ] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${(server.address() as AddressInfo).port}`);
});
