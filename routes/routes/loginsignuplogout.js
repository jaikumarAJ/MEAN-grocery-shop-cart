
module.exports = (app,passport,myMiddleware,path,paths) => {


   app.get(paths.ROOTPATH, myMiddleware.redirectLogin);
    
  
   app.post(paths.LOGIN, passport.authenticate('local-login', {
      successRedirect: paths.ROOTPATH,
      failureRedirect: '/fail'
   }));
  
  
  
   app.get(paths.SIGNUP, (req,res) => {
      res.render('signup.ejs', {errmsg:'',id:'',email:''});
   }); 
  
  
  
   app.post(paths.SIGNUP, myMiddleware.validateInputs, myMiddleware.checkIDAndEmail);
  
  
  
   app.post(paths.SIGNUP2, myMiddleware.validateInputs2, myMiddleware.checkErrsAndSave);
   
   
  
   app.get(paths.SUCCESS, myMiddleware.isLoggedIn, (req,res) =>{
    if(req.user.role == 'admin'){
      res.sendFile(path.resolve('./static/admin.html'));
    }
    else{
      res.sendFile(path.resolve('./static/store.html'));
    }
  });
  
  
  
  app.get(paths.LOGOUT, (req,res) => {
    req.session.destroy(()=>{
      res.redirect(paths.ROOTPATH);
    });
  });
  
  
  app.get(paths.FINISHED, (req,res) => {
    
     res.sendFile(path.resolve('./static/successful_purchase.html'));

   });
  
}