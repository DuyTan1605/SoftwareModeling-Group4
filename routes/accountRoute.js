var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var multer = require('multer');
var fs = require('fs');
var restrict = require('../middle-wares/restrict');
var account = require('../models/account');
var mkdirp = require('mkdirp');
var mv = require('mv');
var mime = require('mime');
var srcdir = './public/Imgs/temp';
var destdir = './public/Imgs/sp/';
var accountRoute = express.Router();
var name = ['main_thumbs', 'main', '1_thumbs', '1'];
var count = -1;
var bcrypt = require('bcryptjs');

const dotenv = require("dotenv");
dotenv.config();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirp(srcdir, function (err) {
            console.log('created temp folder');
        });
        cb(null, srcdir);
    },
    filename: function (req, file, cb) {
        count++;
        if (count > 3) {
            count = 0;
        }

        cb(null, name[count] + '.' + mime.extension(file.mimetype));
    }
})

var upload = multer({ storage: storage });
var nodemailer = require('nodemailer');

accountRoute.get('/login', function (req, res) {
    if (req.session.isLogged === true) {
        res.redirect('/home');
    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

accountRoute.post('/login', async function (req, res) {

    const temp = await account.loadAccountbyEmail(req.body.email);
    var bcrypt = require('bcryptjs');
    var salt;
    if (temp != null) {
        salt = temp.matkhau.substring(temp.matkhau.length - 29);
        if (salt.search(";") != -1) {
            salt = temp.matkhau.substring(temp.matkhau.length - 34);
        }
    }
    else {
        salt = bcrypt.genSaltSync(10);
    }
    salt = salt.replace(/&#x2F;/g, "/");

    var ePWD = bcrypt.hashSync(req.body.password, salt) + salt;
    ePWD = ePWD.replace(/&#x2F;/g, "/");
    var entity = {
        email: req.body.email,
        password: ePWD,
    };

//     var remember = req.body.remember=="on" ? true : false;
//     //console.log("Remember "+ remember);
//     console.log(entity.password);
//     account.login(entity)
//         .then(function(account) {
//             console.log("acccount is");
//             console.log(account);
//             if (account === null) {
//                 res.render('account/login', {
//                     layoutModels: res.locals.layoutModels,
//                     showError: true,
//                     errorMsg: 'Thông tin đăng nhập không đúng.'
//                 });
//             } else {
//                 //account.dob = moment(account.dob, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY');
//                 req.session.isLogged = true;
//                 req.session.account = account;
//                 //req.session.cart = [];

//                  if (remember == true) {
//                     var hour =3600000;
//                    req.session.cookie.expires = new Date(Date.now() + hour);
//                    req.session.cookie.maxAge = hour;
//                 }
//             //    if(account.status!=0)
//             //    {
//                 var url = '/home';
//                 //console.log(req.query.retUrl);
//                 if (req.query.retUrl) {
//                     url = req.query.retUrl;
//                 }
//                 if(req.session.account.permission>1)
//                 {
//                     url='/manager';
//                 }
//                 res.redirect(url);

//             }
//         });


// });

// accountRoute.post('/logout', restrict, function(req, res) {
//     req.session.isLogged = false;
//     req.session.account = null;
//     req.session.cookie.expires = new Date(Date.now() - 1000);
//     //console.log(req.session);
//     res.redirect(req.headers.referer);
// });

// accountRoute.get('/register', function(req, res) {
//     res.render('account/register', {
//         layoutModels: res.locals.layoutModels,
//         showError: false,
//         errorMsg: ''
//     });
// });

// accountRoute.post('/register', function(req, res) {

//     var bcrypt = require('bcryptjs');
//     var salt = bcrypt.genSaltSync(10);
//     var ePWD = bcrypt.hashSync(req.body.rawPWD,salt)+salt;
//     while(ePWD.search(';')!=-1)
//     {
//         salt = bcrypt.genSaltSync(10);
//         ePWD = bcrypt.hashSync(req.body.rawPWD,salt)+salt;
//     }
//     var ngender = req.body.radioGender;
//     var entity = {
//         password: ePWD,
//         name: req.body.name,
//         email: req.body.email,
//         dob: req.body.dob,
//         permission: 1,
//         gender: ngender,
//         address:req.body.address,
//         phone:req.body.phone
//     };
//     account.isEmailExisted(entity)
//         .then(function(result) {
//             console.log(result);
//             if (result) {
//                 res.render('account/register', {
//                     layoutModels: res.locals.layoutModels,
//                     showError: true,
//                     errorMsg: 'Đăng ký thất bại. Email đã tồn tại.'
//                 });
//             } else {
//                 account.insert(entity)
//                     .then(function(insertId) {
//                         res.render('account/register', {
//                             layoutModels: res.locals.layoutModels,
//                             showSuccess: true,
//                             errorMsg: 'Đăng ký thành công.'
//                         });
//                     });
//             }
//         });

// });

// //Thay đổi thông tin người dùng
// accountRoute.post('/profile', function(req, res) {
//     var dateOB = moment(req.body.dob, 'YYYY-MM-DD').format('YYYY-MM-DD');
//     //console.log(dateOB);
//     var entity = {
//         id: req.body.id,
//         name: req.body.name,
//         gender: req.body.gender,
//         dob: dateOB,
//         address:req.body.address,
//         phone:req.body.phone
//     };

//     account.updateInfo(entity).then(function(account) {
//         res.locals.layoutModels.account = account;
//         req.session.account = account;
//         //console.log(account);
//         res.render('account/profile', {
//             layoutModels: res.locals.layoutModels,
//             showError: true,
//             errorMsg: 'Cập nhật thông tin thành công'
//         });
//     });
// });

// accountRoute.get('/profile', restrict, async function(req, res) {

// var accountData=await account.loadAccountbyEmail(res.locals.layoutModels.account.email);
//    res.locals.layoutModels.account={
//        id:accountData.id,
//        name:accountData.ten,
//        email:accountData.email,
//        dob:accountData.ngaysinh,
//        permission:accountData.quyenhan,
//        gender:accountData.gioitinh,
//        positivepoint:accountData.diemcong,
//        address:accountData.diachi,
//        type:accountData.loaitk,
//        phone:accountData.sodienthoai
//    };
//  console.log(res.locals.layoutModels);
//     res.render('account/profile', {
//         layoutModels: res.locals.layoutModels
//     });
// });

// accountRoute.get('/changePassword', restrict, function(req, res) {
//     res.render('account/changePassword', {
//         layoutModels: res.locals.layoutModels
//     });
// });

// accountRoute.post('/changePassword', restrict, async function(req, res) {
//     const temp=await account.loadAccountbyEmail(res.locals.layoutModels.account.email);
//       var bcrypt = require('bcryptjs');
//       var salt;
//       if(temp!=null)
//       {
//          salt = temp.matkhau.substring(temp.matkhau.length-29);
//          if(salt.search(";")!=-1)
//          {
//             salt = temp.matkhau.substring(temp.matkhau.length-34);
//          }
//       }
//       else
//       {
//         salt=bcrypt.genSaltSync(10);
//       }
//      salt=salt.replace(/&#x2F;/g,"/");
//     //console.log(req.body.oldPW,req.body.newPW,res.locals.layoutModels.account.id);
//     var oldPW=bcrypt.hashSync(req.body.oldPW,salt)+salt;
//     var newPW=bcrypt.hashSync(req.body.newPW,salt)+salt;
//     oldPW=oldPW.replace(/&#x2F;/g,"/");
//     newPW=newPW.replace(/&#x2F;/g,"/");
//     var pw = {
//         id: res.locals.layoutModels.account.id,
//         oldPW:oldPW ,
//         newPW: newPW
//     };
//     //console.log(pw);
//     account.updatePassword(pw).then(function(result) {
//         if (result == 1) {
//             res.render('account/changePassword', {
//                 layoutModels: res.locals.layoutModels,
//                 successMsg: true,
//                 errorMsg: 'Mật khẩu đã được thay đổi thành công.'
//             });
//         } else {
//             res.render('account/changePassword', {
//                 layoutModels: res.locals.layoutModels,
//                 failMsg: true,
//                 errorMsg: 'Mật khẩu cũ không khớp. Vui lòng nhập lại'
//             });
//         }

//     });

// });

// accountRoute.get('/', restrict, function(req, res) {

//     res.render('account/profile', {
//         layoutModels: res.locals.layoutModels
//     });
// });

// accountRoute.get("/historyBooking",restrict,async function(req,res){
//     var historyList=await account.loadHistoryBooking(res.locals.layoutModels.account.id);
//     res.render('account/historyBooking',{historyList:historyList});
// })
// accountRoute.get("/resetPassword",function(req,res)
// {
//     res.render("account/rePass",
//     {
//         showError:req.session.showError,
//         errorMsg:req.session.errorMsg
//     });
// })

// accountRoute.post("/resetPassword",function(req,res)
// {
//   // console.log(req.body.email);
//    var mailOptions = {
//     from: 'dreamleage1999@gmail.com', // sender address
//     to: req.body.email, // list of receivers
//     subject: "Thông báo reset mật khẩu", // Subject line
//     text: "Tài khoản bạn đã được reset mậu khẩu là: 77779999", // plaintext body
// };
//      var bcrypt = require('bcryptjs');
//       var salt=bcrypt.genSaltSync(10);
//     var newPW=bcrypt.hashSync('77779999',salt)+salt;

//     newPW=newPW.replace(/&#x2F;/g,"/");
//     var pw = {
//         id: req.body.email,
//         newPW: newPW
//     };

//     var smtpTransport = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.gmail_auth,
//             pass: process.env.password_auth
//         }
//     });

//     account.setNewPass(pw).then(function(result) {

//         if (result>0) {


//             res.render('account/rePass', {
//                 layoutModels: res.locals.layoutModels,
//                 showError: true,
//                 errorMsg: 'Thông tin mật khẩu reset đã gởi về email'
//             });
//             smtpTransport.sendMail(mailOptions, function(error, response) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log("Message sent: " + response.message);
//                 }});
//         } else {
//             res.render('account/rePass', {
//                 layoutModels: res.locals.layoutModels,
//                 showError: true,
//                 errorMsg: 'Tài khoản email không tồn tại'
//             });
//         }

//     });
// })

// accountRoute.get("/response",restrict,function(req,res)
// {
//     res.render("account/response");
// })
// accountRoute.post("/response",restrict,function(req,res)
// {
//     var currentdate = new Date();
//     var datetime = currentdate.getDate() + "/" + (currentdate.getMonth()+1)
//     + "/" + currentdate.getFullYear() + " - " 
//     + currentdate.getHours() + ":" 
//     + currentdate.getMinutes() + ":" + currentdate.getSeconds();
//     console.log(datetime);
//     account.insertResponse(res.locals.layoutModels.account.id,req.body.contentResponse,datetime);
//     res.render("account/sendSuccess");
// })
// accountRoute.get("/listresponse",restrict,async function(req,res)
// {
//     var listResponse=await account.loadAllResponse(res.locals.layoutModels.account.id);
//     res.render("account/listresponse",{historyList:listResponse});
// })
// module.exports = accountRoute;
