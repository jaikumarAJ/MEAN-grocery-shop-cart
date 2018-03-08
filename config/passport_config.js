LocalStrategy = require('passport-local').Strategy;
User = require('../mongoose_models/user');
bcrypt = require('bcrypt');


module.exports = passport => {

    passport.serializeUser((user,done) => {
        done(null, user.id);

    });

    passport.deserializeUser((id, done) => {

        User.findById(id, (err,user) => {
            done(err,user);
            }
        )

    });


    passport.use('local-login', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'pswd',
        passReqToCallBack: true

    },(email, password, done) => {

        User.findOne({ 'email' : email},(err,user) => {

            if(err){
                console.log(err);
            }

            if(!user){

                return done(null, false);

            }
            bcrypt.compare(password, user.pswd, function(err, res) {
                if(res !== true){
    
                    return done(null, false);
    
                }
                return done(null, user);
            });


        });

    }

    ));

}