var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// Configure express-session
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false, httpOnly: false }
}));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Set the domain of your client application
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)
  next();
});



// Import All Api
const dbConnection = require('./routes/api/DBConnection/dbchange');
const projectInfo = require('./routes/api/GetProjects/getProjectInfo');
const vsSurvey = require('./routes/api/FildSurvey/vsSurvey');
const asignSurvey = require('./routes/api/FildSurvey/asignSurveyor');
const piechart = require('./routes/api/FildSurvey/pieChart');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  origin: '*',
}

app.use(cors());


app.use('/', indexRouter);
app.use('/users', usersRouter);


// Use of All Api 

app.use('/api/switchDatabase/', dbConnection);
app.use('/api', projectInfo);
app.use('/api', piechart);
app.use('/api/vs', vsSurvey);
app.use('/api/as', asignSurvey);









/*********************End API*************************** */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
