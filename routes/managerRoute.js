var express = require('express');
var account = require('../models/account.js');
var crypto = require('crypto');
var moment = require('moment');
var nodemailer = require('nodemailer');
var film = require('../models/film');
var helperModel = require("../models/helper");
var eventModel = require("../models/event");
var serviceModel = require("../models/service");
var responseModel = require("../models/response");
var bookModel = require("../models/book");
var showTimeModel = require("../models/show-time");
var ticketModel = require("../models/ticket");
const dotenv = require("dotenv");
dotenv.config();
var cinemaRoomModel = require("../models/cinemaRoom");
var reportModel = require("../models/report");



const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_cloud_key,
    api_secret: process.env.api_secret
})

var multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/Imgs/movies'),
            cb(null, './public/Imgs/events')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.originalname)
    }
})

const helpers = require('handlebars-helpers');
const accountRoute = require('./accountRoute.js');
// const { delete } = require('../app-helpers/dbHelper.js');

var upload = multer({ storage: storage });
var managerRoute = express.Router();

managerRoute.get("/", function (req, res) {
    res.render("manager/index");
})

managerRoute.get('/account', function (req, res) {
    account.loadAll().then(function (rows) {
        res.render('manager/account/index', {
            layoutModels: res.locals.layoutModels,
            accounts: rows,
            errorMsg: req.session.errorMsg
        });
        delete req.session.errorMsg;
    });


});
managerRoute.post('/account/reset', function (req, res) {
    var bcrypt = require('bcryptjs');
    var salt = bcrypt.genSaltSync(10);
    var ePWD = bcrypt.hashSync(process.env.password_hash, salt) + salt;
    while (ePWD.search(';') != -1) {
        salt = bcrypt.genSaltSync(10);
        ePWD = bcrypt.hashSync(process.env.password_hash, salt) + salt;
    }
    ePWD = ePWD.replace(/&#x2F;/g, "/");
    var entity = {
        id: req.body.accId,
        pass: ePWD
    };
    var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.gmail_auth,
            pass: process.env.password_auth
        }
    });
    account.reset(entity).then(function (affectedRows) {
        account.getEmailById(req.body.accId).then(function (row) {
            console.log(row);
            var mailOptions = {
                from: 'dreamleage1999@gmail.com', // sender address
                to: row.email, // list of receivers
                subject: "Thông báo reset mật khẩu", // Subject line
                text: "Tài khoản bạn đã được reset mậu khẩu là: 77779999", // plaintext body
            };
            //console.log(mailOptions.to);

            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }

                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
            });
            // req.session.errorMsg="Reset mật khẩu thành công.Vui lòng kiểm tra email";
            // res.redirect('/manager/account');
            account.loadAll().then(function (rows) {
                res.render('manager/account/index', {
                    layoutModels: res.locals.layoutModels,
                    accounts: rows,
                    errorMsg: "Reset mật khẩu thành công.Vui lòng kiểm tra email"
                });
                delete req.session.errorMsg;
            });
        });

    });

});

managerRoute.post('/account/delete', async function (req, res) {
    var entity = {
        id: req.body.accId
    };
    //console.log(entity);
    var check = await account.isDebt(parseInt(req.body.accId));
    if (check != 1) {
        var res1 = await account.delete(entity);
        account.loadAll().then(function (rows) {
            res.render('manager/account/index', {
                layoutModels: res.locals.layoutModels,
                accounts: rows,
                errorMsg: "Xóa tài khoản thành công"
            });
            delete req.session.errorMsg;
        });
    }
    else {
        // req.session.errorMsg="Tài khoản đang có lịch đặt vé";
        // res.redirect('/manager/account');
        account.loadAll().then(function (rows) {
            res.render('manager/account/index', {
                layoutModels: res.locals.layoutModels,
                accounts: rows,
                errorMsg: "Tài khoản đang có lịch đặt vé"
            });
            delete req.session.errorMsg;
        });
    }


});


module.exports = managerRoute;
