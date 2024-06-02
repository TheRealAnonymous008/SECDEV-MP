"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const cookieparser = require("cookie-parser");
const bodyParser = require('body-parser');
const debug = require('debug')('my express app');
const app = (0, express_1.default)();
const cors = require('cors');
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(cookieparser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express_1.default.static(path.join(__dirname, 'public')));
// Enable cors
var corsOptions = {
    // origin: ["https://toptech-autoworks-logger.netlify.app", "http://localhost:5000", "https://autoworks-logger-api.netlify.app, https://autoworks-api.up.railway.app/api/authz/login"],
    origin: ["http://localhost:5000"],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization', "access-control-allow-credentials"],
    methods: ['GET', 'POST', 'DELETE']
};
app.use(cors(corsOptions));
const authz_1 = __importDefault(require("./routes/authz"));
const customer_1 = __importDefault(require("./routes/customer"));
// TOOD: Put all routes here
// route calls
app.use('/api/authz', authz_1.default);
// app.use('/api/vehicle', vehicleRoutes);
// app.use('/api/order', orderRoutes);
app.use('/api/customer', customer_1.default);
// app.use('/api', enumRoutes);
// app.use('/', indexRoute);
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function () {
    console.log(`Express server listening on port ${server.address().port}`);
});
