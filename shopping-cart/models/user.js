var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
});

module.exports = mongoose.model('User', userSchema);

// DiscountJonas: hier moeten nog methoden bij en een importmodule die password heet om de wachtwoorden te versleutelen (en dan weer te ontcijferen voor de validation)