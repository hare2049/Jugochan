var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
const bcrypt = require('bcrypt');

// var postRouter = require('./routes/post');

var indexRouter = require('./routes/index');
var bRouter = require('./routes/b');
var hisRouter = require('./routes/his');
var litRouter = require('./routes/lit');
var muRouter = require('./routes/mu');
var polRouter = require('./routes/pol');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser('mojasifra'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/jugochan.ico'));

//app.use('/post', postRouter);

app.use(function (req, res, next){
    if(Object.keys(req.cookies).length === 0){
      let unix_time = toString(Date.now());
      bcrypt.hash(unix_time, 5, function (err, hash) {
        if (err) next(err)
        else {
          res.cookie('session_id', hash)
          next()
        }
    })
  }
    else
      next()
})

app.use('/b', bRouter);
app.use('/his', hisRouter);
app.use('/lit', litRouter);
app.use('/mu', muRouter);
app.use('/pol', polRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
