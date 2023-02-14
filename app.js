var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const env = require('./config/env')();
var cors = require('cors');
const cronManager = require("node-cron");
global.APP_PATH = path.resolve(__dirname);
global.Joi = require('joi');

//Routes files
const user = require('./routes/user');
const question = require('./routes/question');
const urls = require('./routes/urls');

var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

require('./dbConnection').connectDB;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '100mb', extended: true, parameterLimit: 1000000
}));
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
  });

// Application Routes 
app.use('/api/user', user);
app.use('/api/question', question);
app.use('/urls', urls);

app.options('/*', cors()) // enable pre-flight request for DELETE request
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in staging
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'staging' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render('404', { baseUrl: env.SITEURL })
});

module.exports = app;
