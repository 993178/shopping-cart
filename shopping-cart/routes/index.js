var express = require('express');
var router = express.Router();
var Product = require('../models/product');   // productmodel binnenhalen (het schema, niet dat seedergedoe) 
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(error, docs) {    // Product.find() zoekt alles wat er aan producten te vinden valt, => docs in de callback
    var productChunks = [];   // ivm de rows in index.hbs willen we de producten in trio's opdelen, dus arrays van 3 stuks in deze array
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i+= chunkSize) {   // met iedere loop gaan we 3 omhoog: eerst 0, dan 3, dan 6 etc
      productChunks.push(docs.slice(i, i + chunkSize)); // in iedere loop snijden we een brok van 3 stuks uit de docs-array, beginnend bij i, eindigend vóór i + 3, en pushen dat brok in de productChunks-array
    }

    console.log(docs)
    res.render('shop/index', { title: 'Shopping cart', products: docs });  // renderfunctie met te renderen dingen, aangevuld met de products die hier docs heten. Deze moet in de Products.find, anders gebeurt het renderen (synchronous) voordat find (asynchronous) klaar is
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {   // Discount Jonas: next kun je altijd weglaten als je die niet gebruikt, hij zet hem neer want conventie
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {}});  // nieuw karretje maken en daar oud karretje ingooien als argument - ALS die bestaat, anders een leeg object. Je kunt hier ook een mal van maken: {items: {}, totalQty: 0, totalPrice: 0} ipv de pipe operators in cart.js die Discount Jonas prefereert

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');   // nogal summier - er gaat iets fout en je wordt teruggestuurd naar de homepage...
    }
    cart.add(product, product.id);
    console.log(cart);
    req.session.cart = cart;    // wordt ook automatisch opgeslagen
    res.redirect('/');          // dus als het goed gaat, wordt je óók teruggestuurd naar de homepage...!! Lekker gebruikersvriendelijk
  });
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});


module.exports = router;
