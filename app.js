const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const ejs = require('ejs');
const MongoStore = require('connect-mongo')(session);
const expressValidator  = require('express-validator');
const { check, validationResult } = require('express-validator/check');
const paths = require('./config/paths');

mongoose.connect('mongodb://localhost/Final_project', {useMongoClient: true});

app.use(express.static('./static',{index:false}));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'static'));
app.use(session({store: new MongoStore({mongooseConnection: mongoose.connection,ttl: 60 * 60, autoRemove: 'native'}),secret:'abdefg', saveUninitialized: true, resave: true,/*cookie:{maxAge: 60 * 60 * 1000}*/}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('./config/passport_config')(passport);
require('./routes/index.js')(app,passport,paths);
        
app.listen(3003,()=>{
  console.log('listening port 3003');
})

