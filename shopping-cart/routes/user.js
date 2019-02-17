// ROUTES/USER.JS

var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {     // isLoggedIn beschermt deze route; je kunt alleen op /profile komen als je bent ingelogd, zie de functie beneden
    res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {     // eerst de enige routes waarbij je wél ingelogd moet zijn (/profile, /logout), daarna dit dingetje dat je naar de homepage stuurt als je ingelogd bent en naar signup of signin probeert te gaan
    next();
});

router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');    // de boodschap over wachtwoord al in gebruik komt binnen onder de vlag 'error', hier wordt ie 'messages'
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});  // hasErrors omdat we in die {{ quasi-script }} in de hbs beperkte logicamogelijkheden hebben
  });
  
  router.post('/signup', passport.authenticate('local.signup', {   // bij aanmaak nieuwe user
    succesRedirect: '/user/profile',                                         // bij succes ziet ie zijn profiel (? lijkt me stom)
    failureRedirect: '/user/signup',                                         // bij falen blijft ie bij sign up
    failureFlash: true                                                  // en ziet dan die boodschap dat zijn mailadres al in gebruik is
  }));
  
  router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');    // kopie signup
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
  });
  
  router.post('/signin', passport.authenticate('local.signin', {
    succesRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  }));

  module.exports = router;

  function isLoggedIn(req, res, next) {     // als je niet bent ingelogd ga je maar lekker naar de homepage
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
  };

  function notLoggedIn(req, res, next) {     // als je niet bent ingelogd ga je maar lekker naar de homepage
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
  };