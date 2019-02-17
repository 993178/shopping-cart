var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Product = require('../models/product');   // productmodel binnenhalen (het schema, niet dat seedergedoe)

csrfProtection = csrf();
router.use(csrfProtection);   // 'Express, alle routes moeten beschermd worden door csrfProtection'

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(error, docs) {    // Product.find() zoekt alles wat er aan producten te vinden valt, => docs in de callback
    var productChunks = [];   // ivm de rows in index.hbs willen we de producten in trio's opdelen, dus arrays van 3 stuks in deze array
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i+= chunkSize) {   // met iedere loop gaan we 3 omhoog: eerst 0, dan 3, dan 6 etc
      productChunks.push(docs.slice(i, i + chunkSize)); // in iedere loop snijden we een brok van 3 stuks uit de docs-array, beginnend bij i, eindigend vóór i + 3, en pushen dat brok in de productChunks-array
    }
    res.render('shop/index', { title: 'Shopping cart', producten: docs });  // renderfunctie met te renderen dingen, aangevuld met de products die hier docs heten. Deze moet in de Products.find, anders gebeurt het renderen (synchronous) voordat find (asynchronous) klaar is
  });
});

router.get('/user/signup', function(req, res, next) {
  var messages = req.flash('error');    // de boodschap over wachtwoord al in gebruik komt binnen onder de vlag 'error', hier wordt ie 'messages'
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});  // hasErrors omdat we in die {{ quasi-script }} in de hbs beperkte logicamogelijkheden hebben
});

router.post('/user/signup', passport.authenticate('local.signup', {   // bij aanmaak nieuwe user
  succesRedirect: '/user/profile',                                         // bij succes ziet ie zijn profiel (? lijkt me stom)
  failureRedirect: '/user/signup',                                         // bij falen blijft ie bij sign up
  failureFlash: true                                                  // en ziet dan die boodschap dat zijn mailadres al in gebruik is
}));

router.get('/user/profile', function(req, res, next) {
  res.render('user/profile');
});

router.get('/user/signin', function(req, res, next) {
  var messages = req.flash('error');    // kopie signup
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/user/signin', passport.authenticate('local.signin', {
  succesRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}));

module.exports = router;
