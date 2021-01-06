const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
//const keys=require('./key.js');
const dotenv=require("dotenv");
dotenv.config();
const userModel=require('./models/account');
var Q = require('q');
var deferred = Q.defer();
passport.use(
    new GoogleStrategy({
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: process.env.PORT?'https://movie-project-tkpm.herokuapp.com/auth/google/callback':'http://localhost:3000/auth/google/callback'
    }, async function(request, accessToken, refreshToken, profile, done){
      let user=await userModel.loadAccountbyEmail(profile.emails[0].value);

      if(user)
      {
          let isExist=await userModel.findUserSocial(profile.emails[0].value,1);
          if(isExist)
          {
            return done(null,user);
          }
          let res=await userModel.updateUserSocial({loaitk:1,email:profile.emails[0].value});
          user=await userModel.loadAccountbyEmail(profile.emails[0].value);
          return done(null,user);
      }
     let entity={};
     entity.email=profile.emails[0].value;
     entity.ten=profile.displayName;
     entity.matkhau="";
     entity.ngaysinh="";
     entity.quyenhan=1;
     entity.gioitinh="1";
     entity.diemcong=0;
     entity.diachi="";
     entity.sodienthoai="";
     entity.loaitk=1;
     
     let res1=await userModel.addUserSocial(entity);
      return done(null,entity);
     
     
    })
);

passport.use(new FacebookStrategy({
  clientID: process.env.facebookClientID,
  clientSecret: process.env.facebookClientSecret,
  callbackURL: process.env.PORT?'https://movie-project-tkpm.herokuapp.com/auth/facebook/callback':'http://localhost:3000/auth/facebook/callback'
},async function(accessToken, refreshToken, profile, done) {
  let user=await userModel.loadAccountbyEmail(profile.id);

      if(user)
      {
          let isExist=await userModel.findUserSocial(profile.id,2);
          if(isExist)
          {
            return done(null,user);
          }
          let res=await userModel.updateUserSocial({loaitk:2,email:profile.id});
          user=await userModel.loadAccountbyEmail(profile.id);
          return done(null,user);
      }
     let entity={};
     entity.email=profile.id;
     entity.ten=profile.displayName;
     entity.matkhau="";
     entity.ngaysinh="";
     entity.quyenhan=1;
     entity.gioitinh="1";
     entity.diemcong=0;
     entity.diachi="";
     entity.sodienthoai="";
     entity.loaitk=2;
     
     let res1=await userModel.addUserSocial(entity);
      return done(null,entity);
}
));

passport.serializeUser((user, done) => {
    done(null, user);
   
  });
  
  passport.deserializeUser((user, done) => {
   done(null,user);
 
    // User.findById(id)
    //   .then(user => {
    //     done(null, user);
    //   })
  });
