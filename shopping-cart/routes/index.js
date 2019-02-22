var express = require('express');
var router = express.Router();
var Product = require('../models/product');   // productmodel binnenhalen (het schema, niet dat seedergedoe) 
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0]; // als er net iets is gekocht, willen we de boodschap hier weergeven; de eerste en enige successboodschap die flash standaard in een array stopt
  Product.find(function(error, docs) {    // Product.find() zoekt alles wat er aan producten te vinden valt, => docs in de callback
    var productChunks = [];   // ivm de rows in index.hbs willen we de producten in trio's opdelen, dus arrays van 3 stuks in deze array
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i+= chunkSize) {   // met iedere loop gaan we 3 omhoog: eerst 0, dan 3, dan 6 etc
      productChunks.push(docs.slice(i, i + chunkSize)); // in iedere loop snijden we een brok van 3 stuks uit de docs-array, beginnend bij i, eindigend vóór i + 3, en pushen dat brok in de productChunks-array
    }

    res.render('shop/index', { title: 'Shopping cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg });  // renderfunctie met te renderen dingen, aangevuld met de products die hier docs heten. Deze moet in de Products.find, anders gebeurt het renderen (synchronous) voordat find (asynchronous) klaar is
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

router.get('/checkout', function(req, res, next) {    // komt vanaf shopping-cart.hbs
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];   // eerste (want enige) element in error-array die flash maakt hieronder in regel 69
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});    // we geven errMsg door en checken in noError of ie falsy is, zo ja, dan is noError truthy en geeft checkout.hbs het error-element niet weer...
});

router.post('/checkout', function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');    // als je geen cart hebt, optiefen
  }
  var cart = new Cart(req.session.cart);      // weer cart recreëren (kun je dat woord nog letterlijk gebruiken?)

  // van de Stripe-site! 2019-proof! Woehoe
  var stripe = require("stripe")("sk_test_pQPtnc49JtVufrg3N1lkccT5");   // I heard there was a secret key that David played and it pleased uhm, me

  stripe.charges.create({
    amount: cart.totalPrice * 100,     // in centen!
    currency: "eur",
    source: req.body.stripeToken, // obtained with Stripe.js  // komt overeen met de naam van het toegevoegde tokenveld in checkout.js
    description: "test charge"
  }, function(err, charge) {
    // asynchronously called (rest van de functie is weer van Discount Jonas)
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    req.flash('success', 'Koop gesloten!')    // Wordt op /-pagina weergegeven! zie regel 8
    req.session.cart = null;    // kar leeggooien - ik neem aan dat die ||-operators dit opvatten als 'pak optie 2'
    res.redirect('/');
  });
});

module.exports = router;



// nog doen...

// 1) die fn-foutmelding mbt bootstrap (die is misschien ook verantwoordelijk voor #2  )
// 2) ik wil mijn dropdown! >:-(      Anders opties als li's in ul zetten? Komen ze allemaal naast elkaar op de navbar, maar lekker boeiend

// 3) add to cart-knop doet het niet

// 4) test of sign in en sign up het wel doen...

// 5) test of shopping cart het wel doet...

// 6) zoek 2019-equivalent van Stripe-functie

// 7) kijk of checkout het dan doet (met dummydata van Stripe)