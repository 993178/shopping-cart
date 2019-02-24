var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},    // verwijst naar de User die we in dat model hebben gemaakt
    cart: {type: Object, required: true},           // is dus Cart
    address: {type: String, required: true},        // hebben we een veld voor (één veld maar. voor het hele adres)
    name: {type: String, required: true},           // hebben we een veld voor
    paymentId: {type: String, required: true}       // elke betaling heeft een ID in Stripe (dus... hoe komt die info hier?)

});

module.exports = mongoose.model('Order', schema);