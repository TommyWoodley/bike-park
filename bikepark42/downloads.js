var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var downloads = express();

// view engine setup
downloads.set('views', path.join(__dirname, 'views'));
downloads.set('view engine', 'pug');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
downloads.listen(port);

downloads.use(logger('dev'));
downloads.use(express.json());
downloads.use(express.urlencoded({ extended: false }));
downloads.use(cookieParser());
downloads.use(express.static(path.join(__dirname, 'public')));

downloads.use('/', indexRouter);
downloads.use('/users', usersRouter);

// catch 404 and forward to error handler
downloads.use(function(req, res, next) {
  next(createError(404));
});

// error handler
downloads.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = downloads;
