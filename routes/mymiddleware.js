const expressValidator  = require('express-validator');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const bcrypt = require('bcrypt');
path = require('path');
fs = require('fs');

const isLoggedIn = (req,res,next) => {
    
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
}


const redirectLogin = (req,res) => {

    btnCont = '';
    email = '';
    message = '';

    if(req.isAuthenticated()){

        if(req.user.role == 'admin'){
            btnCont = '<a href="/success"><button type="button" class="btn mybtn">GO ADMIN</button></a><a href="/logout"><button type="button" class="btn mybtn-red">logout</button></a>';  
        }
        else{
            email = req.user.email;
            if(req.user.cart.products.length > 0 && req.user.cart.closed == false){
                btnCont = '<a href="/success"><button type="button" class="btn mybtn mrgn-btn">continue shopping</button></a><a href="/logout"><button type="button" class="btn mybtn-red mrgn-btn">logout</button>'
                message = '<div class="row justify-content-center trans-div"><span class="coraltext">MESSAGE:&nbsp </span><span class="bluetext"> you have an open cart from date -&nbsp </span>' + req.user.cart.date.toDateString() + '</div>'
            }
            else{
                btnCont = '<a href="/success"><button type="button" class="btn mybtn mrgn-btn">start shopping</button></a><a href="/logout"><button type="button" class="btn mybtn-red mrgn-btn">logout</button></a>';
                message = '';
            }
        }
    }
    res.render('index.ejs',{btnCont: btnCont, message: message});
}


const checkIDAndEmail = (req,res,next) => {

    let valid = {};
    let snip = 'border: 2px solid #ca1d20;';
    valid.id = '';
    valid.email = '';
    valid.pass = '';
    valid.confpass = '';

    User.findOne({ 'userId' : req.body.id},(err,user) => {
      
        var errors =  validationResult(req).array();
        errormsgs = [];
                  
        if(err){
            console.log(err);
        }
        if(user){
            errors.push({msg:'user id exists'});
	    valid.id = snip;
        }


        User.findOne({ 'email' : req.body.email},(err,user) => {
            if(err){
                console.log(err);
            }
            if(user){
                errors.push({msg:'email already exists'});
		valid.email = snip;
            }

		console.log(errors);
            if(errors.length>0){

                errors.forEach((item) => {
		if(item.param == 'id'){
	            valid.id = snip; 
		}
		if(item.param == 'email'){
		    valid.email = snip;
                }
		if(item.param == 'pswd'){
                    valid.pass = snip;
                }
		if(item.param == 'cnfpswd'){
                    valid.conpass = snip;
                    valid.pass = snip;
                }
                errormsgs.push(' ' + item.msg);
            })

                res.render('signup.ejs', {errmsg:errormsgs, id:req.body.id, email:req.body.email, valid:valid});

            } 
            else{
                bcrypt.genSalt(9, function(err, salt) {
                    bcrypt.hash(req.body.pswd, salt, function(err, hash) {
	console.log(req.session);
                        req.session.pswd=hash;
                        req.session.email=req.body.email;
                        req.session.userId=req.body.id;
                        res.render('signup2.ejs',{errmsg:'',city:'',street:'',name:''});
                    });
                });
            }  
        });

    });
}


const checkErrsAndSave = (req,res,next) => {
        
    var errors =  validationResult(req).array();
    console.log('VALIDATIONRESULT: '+ validationResult(req));
    console.log('ERRORS: ' + errors);
    errormsgs = [];
    
    if(errors.length>0){
        
        errors.forEach((item) => {
	    console.log('ITEM.MSG: ' + item.msg);
            errormsgs.push(' ' + item.msg);
        })
        
        res.render('signup2.ejs', {errmsg:errormsgs, street:req.body.street, name:req.body.name});
        
    }
    else{
        newUser = new User({userId:req.session.userId, email:req.session.email, name: req.body.name, pswd:req.session.pswd, city:req.body.city, street:req.body.street, cart:{closed:false, products:[],date: getDate(), total: 0}});
        req.session.pswd = '';
        newUser.save();
        req.login(newUser,err => {
            if(err){console.log(err)};
            res.redirect('/');
        })
    }
    
}   


const validateInputs = [check('id','you must enter id number').isLength({min:1}),
check('id','id must be a number').isInt(),
check('email','invalid mail address').isEmail(),
check('pswd','invalid password').isLength({min:3}), 
check('cnfpswd','passwords dont match').custom((value, { req }) => value === req.body.pswd)];

const validateInputs2 = [check('city','city required').isLength({min:1}),
check('street','adress is required').isLength({min:1}),
check('name','name is required').isLength({min:1})];

const checkPay = [check('details[0]','0').isLength({min:1}),
                  check('details[1]',1).isLength({min:1}),
                  check('details[2]',2).isLength({min:1}),
                  check('details[2]',2).custom((value, { req }) => value !== 'choose date'),
                  check('details[3]',3).isLength({min:1}),
                  check('details[4]',4).isLength({min:1}),
                  check('details[4]',4).isInt(),
                  check('details[5]',5).isLength({min:4}),
                  check('details[5]',5).isInt(),
                  check('details[6]',6).isLength({min:1}),
                  check('details[6]',6).custom((value, { req }) => value !== 'enter year'),
                  check('details[7]',7).isLength({min:1}),
                  check('details[7]',7).custom((value, { req }) => value !== 'enter month')] 
                  

const redirectPay = (req,res,next) => {
                      
    var errors =  validationResult(req).array();
    if(errors.length>0){
    
        errormsgs = [];
        errors.forEach((item) => {
            errormsgs.push(item.msg);
        })
    
        res.send({goto:'#!/checkouterr', errors : errormsgs}).end();
    
    }
    else{
        newDelivery = new Delivery({details : {city: req.body.details[0], address: req.body.details[1], date: req.body.details[2], owner: req.body.details[3], cvv: req.body.details[4], cardNumber: req.body.details[5], month: req.body.details[6], year: req.body.details[7], }, cart: { products: req.body.cartDone.products, date: req.body.cartDone.date, total: req.body.cartDone.total}});
        newDelivery.save(closeCart(req,res));
        req.session.delivery = newDelivery;
        res.send({goto: '/finished'}).end();
    }

}


const closeCart = (req,res) => { 
    req.user.cart.closed = true;
    User.findByIdAndUpdate(req.user._id, { $set: { cart: req.user.cart }}, { new: true }, (err, user) => {
        if (err){console.log(err)};
    });
}


const generateOrderFile = (req,res) => { 
    
    let delivery = req.session.delivery; 

    const generateDetails = () => {

    fs.appendFile('purchase.txt', '\r\nDelivery details:\r\n-------------------\r\n address: ' + delivery.details.address + ' , ' + delivery.details.city + '\r\n\r\n' + ' delivery date: ' + delivery.details.date.slice(0,10) + ' , around 12:00 to 17:00\r\n', () => {generateKitty()})};

    const generateKitty = () => {    
                                 
    fs.appendFile('purchase.txt','\r\n' + '  ░░░░░░░▄▀▀▀▀█░░░░░░░░░░░░░░░░░░░░\r\n' +
                                          '  ░░░░░░█▀░░░░█░░░░░░░░░░░░░░░░░░░░\r\n' +
                                          '  ░░░░░█░░░░░░█▀▀▀▄▄░░░░░░▓░░░░░░░░\r\n' +
                                          '  ░░░░▄█░░░░░░░░░░░░▀▀▄▄░▓▓▓░░░░░░░\r\n' +
                                          '  ░░░▄█░░░░░░░░░░░░░░░░░▀▓▓▓▓▀▀▀█░░\r\n' +
                                          '  ▀▄▄█░░░░░░░░░░░░░░░░▓▓▓▓▓▓▓▓░░█░░\r\n' +
                                          '  ▀▄█░▀▄░░░░▄▄░░░░░░▓▓▓▓▓▓▓░░▓▓▓▓▓▓\r\n' +
                                          '  ▄▀█▀▄░░░░███░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓░\r\n' +
                                          '  ░▀█▀▄░░░░▀▀░░░░░░░░░▄▄░░░▓▓▓▓▓░░░\r\n' +
                                          '  ░░▀█░░░░░░░░▄▄░░░░░███░░░░▓▓░█░░░\r\n' +
                                          '  ░░░▀█░░░░░░█░░▀▄░░░▀▀░░░░░▓░█▀░░░\r\n' +
                                          '  ░░░░▀█░░░░░░▀▄▄▀░░░░░░░░▀▄░█▀░░░░\r\n' +
                                          '  ░░░░░░▀█▄░░░░░░░░░░░░░▀▄░░██░░░░░\r\n' +
                                          '  ░░░░░░░░░▀█▄░░░░░░░░▀▄░░██▀░▀░░░░\r\n' +
                                          '  ░░░░░░░░░░░░▀▀▄▄▄▄▄▄▄█▀█░░▀▄░░░░░\r\n' +
                                          '  ░░░░░░░░░░░░░░░░░░░░░░░░▀░░░░░░░░\r\n', () =>{generateProducts()})};

    
    const generateProducts = () => {

        const generateLine = () => {fs.appendFile('purchase.txt','\r\n' + ' -----------------------------------------------' + '\r\n' + ' total: ' + delivery.cart.total + 'nis\r\n', () => {res.download('purchase.txt', () => {fs.unlink('purchase.txt')})})};
        
        writeProduct = i =>{
            if(i<delivery.cart.products.length){    
                fs.appendFile('purchase.txt','\r\n  ' + delivery.cart.products[i].productName + '- price: ' + delivery.cart.products[i].price + ' , quantity: ' + delivery.cart.products[i].q + ' = ' + delivery.cart.products[i].price*delivery.cart.products[i].q + ' nis\r\n',() => {writeProduct(i+1)});
            }
            else{generateLine()}
        }
        writeProduct(0);
    }  
    generateDetails();
}
    


const getDate = () => {

let date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth()+1;
    let yyyy = date.getFullYear(); 

    date = mm + '/' + dd + '/' + yyyy;
    return date;

}

        
module.exports = {

    checkIDAndEmail : checkIDAndEmail,
    checkErrsAndSave : checkErrsAndSave,
    validateInputs : validateInputs,
    validateInputs2 : validateInputs2,
    isLoggedIn : isLoggedIn,
    redirectLogin, redirectLogin,
    getDate : getDate,
    checkPay : checkPay,
    redirectPay : redirectPay,
    generateOrderFile : generateOrderFile

}
