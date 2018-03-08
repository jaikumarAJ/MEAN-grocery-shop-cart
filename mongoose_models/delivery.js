mongoose = require('mongoose');
Schema = mongoose.Schema;

let deliverySchema = new Schema({

    details:
        {
         city : String,            
         address: String,
         date: Date,
         owner: String,
         cvv: Number,
         cardNumber: Number,
         year: Number,
         month: Number },
    cart:
        { 
         products: Array,
         date: Date,
         total: Number }
});

module.exports = mongoose.model('Delivery', deliverySchema);