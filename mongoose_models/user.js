mongoose = require('mongoose');
Schema = mongoose.Schema;

let userSchema = new Schema({

    userId: Number,
    email: String,
    name: String,
    pswd: String,
    city: String,
    street: String,
    cart: {closed: Boolean, date: Date, products:[], total: Number},
    role: String

});

module.exports = mongoose.model('User', userSchema);