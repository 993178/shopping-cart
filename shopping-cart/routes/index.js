var express = require('express');
var router = express.Router();
var Product = require('../models/product');   // productmodel binnenhalen (het schema, niet dat seedergedoe)
var csrf = require('csurf');

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
  res.render('user/signup', {csrfToken: req.csrfToken()});
});

router.post('/user/signup', function (req, res, next) {
  res.redirect('/');  // tijdelijk
})

module.exports = router;
