express = require('express');
api = express.Router();
Product = require('../../mongoose_models/product');
Delivery = require('../../mongoose_models/delivery');
myMiddleware = require('../mymiddleware');


api.get('/getAllProducts', (req,res) => {

    Product.find({}, (err,products) => {
        res.send(products).end();

    });

})


api.get('/getCategories', (req,res) => {

    Product.aggregate([{$group : {_id : "$category"}}], (err,categories) => {
        res.send(categories);
    });

})


api.get('/getCart', (req,res) => {

    User.find({_id: req.user.id},(err,user) => {
       
        res.send(user[0].cart).end();

    });

});


api.get('/getProduct/:id', (req,res) => {

    Product.find({productId:req.params.id}, (err,product) => {
        res.send(product).end();
    })

})


api.post('/addProductToCart', (req,res) => {

    req.user.cart.date = myMiddleware.getDate();  
    req.user.cart.products.push(req.body);
    req.user.cart.total = Math.round((req.user.cart.total+req.body.q*req.body.price)*100)/100;

    req.user.cart.closed = false;
    User.findByIdAndUpdate(req.user._id, { $set: { cart: req.user.cart }}, { new: true }, (err, user) => {
        if (err){console.log(err)};
        
        cart = user.cart;
        res.send(cart).end();

        });
        
    });


api.post('/removeProductFromCart', (req,res) => { 

    req.user.cart.date = myMiddleware.getDate();

    req.user.cart.total = Math.round((req.user.cart.total - req.user.cart.products[req.body.itemIndex].q * req.user.cart.products[req.body.itemIndex].price)*100)/100;
    req.user.cart.products.splice(req.body.itemIndex,1);
    
    User.findByIdAndUpdate(req.user._id, { $set: { cart: req.user.cart}}, {new: true}, (err, user) => {
        if (err){console.log(err)};

        cart = user.cart;
        res.send(cart).end();

        });


    });


api.post('/pay',myMiddleware.checkPay, myMiddleware.redirectPay);

api.get('/download',myMiddleware.generateOrderFile);

module.exports = api;

