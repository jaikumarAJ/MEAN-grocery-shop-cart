const express = require('express');
const path = require('path');
const loginSignupLogoutRoute = require('./routes/loginsignuplogout');
const myMiddleware = require('./mymiddleware');
const apiService = require('./routes/apiservice');


module.exports = (app,passport,paths) => {

  
require('./routes/loginsignuplogout')(app,passport,myMiddleware,path,paths);

app.use(paths.API, myMiddleware.isLoggedIn, apiService);


}

