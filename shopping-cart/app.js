var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars'); // vanwege toegevoegd pakket...
var mongoose = require('mongoose');   // iets met de server
var session = require('express-session');
var passport = require('passport');   // voor encryptie
var flash = require('connet-flash');  // om boodschappen via de view te kunnen doorgeven
var validator = require('express-validator');

var indexRouter = require('./routes/index');

var app = express();
mongoose.connect('localhost:27017/shopping');
require('./config/passport');   // pas hierlangs komt index.js te weten dat er een passport.js bestaat met de benodigde info, deze require is in plaats van al die code in dat bestand

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
//app.set('view engine', 'hbs');
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());   // altijd na bodyparser... die we niet hebben... maar die twee regels hierboven met express zijn verder exact hetzelfde als zijn bodyparserregels. Iets met data (uit de UI?) die moeten worden omgezet tot iets waar de validator iets mee kan
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false})); // DiscountJonas zet die laatste twee op false omdat anders de sessie automatisch op de server wordt opgeslagen, ook als er niks veranderd is
app.use(flash());   // altijd ná session
app.use(passport.initialize());
app.use(passport.session());  // ook na session     docs op passportjs.org (althans toen) met een hele zoot strategies; we gebruiken passport-local, maar je kunt dit dus ook gebruiken om mensen via Facebook of Twitter of wat dan ook te laten inloggen
app.use(express.static(path.join(__dirname, 'public')));

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
