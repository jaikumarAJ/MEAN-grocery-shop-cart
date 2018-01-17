mongoose = require('mongoose');
Schema = mongoose.Schema;

let productSchema = new Schema({

    productId: Number,
    productName: String,
    category: String,
    price: Number,
    img: String

});

module.exports = mongoose.model('Product', productSchema);