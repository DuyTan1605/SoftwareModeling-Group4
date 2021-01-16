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

managerRoute.get('/film', async function (req, res) {
    var filmList = await film.getFilm();
    res.render('manager/film/index', { film: filmList });
    //delete req.session.errorDelete;
})
managerRoute.get('/editFilm', async function (req, res) {
    var detailFilm = await film.getFilmById(parseInt(req.query.id));
    console.log(detailFilm);
    var categories = await film.loadAllType();
    for (let j = 0; j < categories.length; j++) {
        categories[j].isChecked = 0;
        for (let i = 0; i < detailFilm[0].arrFilmType.length; i++) {
            if (detailFilm[0].arrFilmType[i] == categories[j].tentheloai) {
                categories[j].isChecked = 1;
            }
        }
    };
    console.log(categories);
    res.render('manager/film/edit', { film: detailFilm[0], categories: categories });
})
managerRoute.post('/editFilm', function (req, res) {
    const upload1 = multer({ storage }).single('filmImage');
    var temp;
    upload1(req, res, async function (err) {
        if (err) {
            return res.send(err)
        }
        //   console.log('file uploaded to server')
        //   console.log(req.file || "no")

        // SEND FILE TO CLOUDINARY

        if (!req.file) {
            var entity = {
                idphim: req.body.filmId,
                tenphim: req.body.filmName.toUpperCase(),
                theloai: req.body.filmType,
                ngayphathanh: req.body.datePublic,
                daodien: req.body.filmDirector,
                dienvien: req.body.filmActor,
                tomtat: req.body.filmSummary,
                thoiluong: parseInt(req.body.filmDuration),
                diemdanhgia: parseFloat(req.body.filmPoint),
                hinhanh: req.body.temp_filmImage,
                tinhtrang: parseInt(req.body.filmStatus),
                khoichieu: req.body.dateShow,
                linktrailer: req.body.filmTrailer
            }
            //console.log(entity);
            var result = await film.updateInfoFilm(parseInt(req.body.filmId), entity);
            var deleteRes = await film.deleteFilmType(req.body.filmId);
            for (let i = 0; i < req.body.filmType.length; i++) {
                var filmTypeRes = await film.addFilmType(req.body.filmId, parseInt(req.body.filmType[i]));
            }
            var categories = await film.loadAllType();
            for (let j = 0; j < categories.length; j++) {
                categories[j].isChecked = 0;
                for (let i = 0; i < req.body.filmType.length; i++) {
                    if (req.body.filmType[i] == categories[j].idtheloai) {
                        categories[j].isChecked = 1;
                    }
                }
            };
            //console.log(result.changedRows>0);
            if (result.changedRows > 0) {

                res.render(`manager/film/edit`, { film: entity, errorEdit: "Cập nhật thông tin thành công", categories: categories });

            }
            else {

                res.render(`manager/film/edit`, { film: entity, errorEdit: "Cập nhật thông tin thất bại", categories: categories });

            }

        }

        const path = req.file.path;
        const uniqueFilename = new Date().toISOString()

        cloudinary.uploader.upload(
            path,
            { public_id: `projectmovies/${uniqueFilename}`, tags: `projectmovies` }, // directory and tags are optional
            async function (err, image) {
                if (err) return res.send(err)
                console.log('file uploaded to Cloudinary')
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
                // return image details
                //temp=res.json(image);
                console.log("Temp is");
                console.log(image);

                var entity = {
                    idphim: req.body.filmId,
                    tenphim: req.body.filmName.toUpperCase(),
                    theloai: req.body.filmType,
                    ngayphathanh: req.body.datePublic,
                    daodien: req.body.filmDirector,
                    dienvien: req.body.filmActor,
                    tomtat: req.body.filmSummary,
                    thoiluong: parseInt(req.body.filmDuration),
                    diemdanhgia: parseFloat(req.body.filmPoint),
                    hinhanh: image.url,
                    tinhtrang: parseInt(req.body.filmStatus),
                    khoichieu: req.body.dateShow,
                    linktrailer: req.body.filmTrailer
                }

                var result = await film.updateInfoFilm(parseInt(req.body.filmId), entity);
                var deleteRes = await film.deleteFilmType(req.body.filmId);
                for (let i = 0; i < req.body.filmType.length; i++) {
                    var filmTypeRes = await film.addFilmType(req.body.filmId, parseInt(req.body.filmType[i]));
                }
                var categories = await film.loadAllType();
                for (let j = 0; j < categories.length; j++) {
                    categories[j].isChecked = 0;
                    for (let i = 0; i < req.body.filmType.length; i++) {
                        if (req.body.filmType[i] == categories[j].idtheloai) {
                            categories[j].isChecked = 1;
                        }
                    }
                };
                //console.log(result.changedRows>0);
                if (result.changedRows > 0) {

                    res.render(`manager/film/edit`, { film: entity, errorEdit: "Cập nhật thông tin thành công", categories: categories });

                }
                else {

                    res.render(`manager/film/edit`, { film: entity, errorEdit: "Cập nhật thông tin thất bại", categories: categories });

                }

            }
        )
    })




    // res.redirect('manager/film');
})

managerRoute.get("/addFilm", async function (req, res) {
    var categories = await film.loadAllType();
    //console.log(listType[0]);
    res.render("manager/film/add", { categories: categories });
})
managerRoute.post('/addFilm', function (req, res) {

    const upload1 = multer({ storage }).single('filmImage');
    var temp;
    upload1(req, res, function (err) {
        if (err) {
            return res.send(err)
        }
        //   console.log('file uploaded to server')
        //   console.log(req.file)

        // SEND FILE TO CLOUDINARY


        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
        //console.log(path);
        cloudinary.uploader.upload(
            path,
            { public_id: `projectmovies/${uniqueFilename}`, tags: `projectmovies` }, // directory and tags are optional
            async function (err, image) {
                if (err) return res.send(err)
                console.log('file uploaded to Cloudinary')
                // remove file from server
                const fs = require('fs')
                fs.unlinkSync(path)
                // return image details
                //temp=res.json(image);
                //   console.log("Temp is");
                //   console.log(image);
                var entity = {
                    tenphim: req.body.filmName.toUpperCase(),
                    theloai: req.body.filmType,
                    ngayphathanh: req.body.datePublic,
                    daodien: req.body.filmDirector,
                    dienvien: req.body.filmActor,
                    tomtat: req.body.filmSummary,
                    thoiluong: parseInt(req.body.filmDuration),
                    diemdanhgia: parseFloat(req.body.filmPoint),
                    hinhanh: image.url,
                    tinhtrang: parseInt(req.body.filmStatus),
                    khoichieu: req.body.dateShow,
                    linktrailer: req.body.filmTrailer
                }
                //console.log(entity);
                var categories = await film.loadAllType();
                // console.log(entity);
                var newFilm = await film.addNewFilm(entity);
                var nowId = await helperModel.getMaxId();
                // console.log("Now id"+nowId);
                for (let i = 0; i < req.body.filmType.length; i++) {
                    console.log(nowId, parseInt(req.body.filmType[i]));
                    var filmTypeRes = await film.addFilmType(nowId, parseInt(req.body.filmType[i]));
                }
                res.render("manager/film/add", { categories: categories, errorAdd: "Thêm mới phim thành công" });
                delete req.session.errorAdd;
            }
        )
    })



})
managerRoute.post("/film/delete", async function (req, res) {
    var isPresentFilm = await film.isPresent(parseInt(req.body.filmId));

    if (isPresentFilm) {
        var filmList = await film.getFilm();
        //req.session.errorDelete = 'Phim đang nằm trong danh sách phim đang chiếu';
        res.render('manager/film/index', { film: filmList, errorDelete: 'Phim đang nằm trong danh sách phim đang chiếu' });
    }
    else {
        var delFilm = await film.deleteFilmById(parseInt(req.body.filmId));
        var filmList = await film.getFilm();
        res.render('manager/film/index', { film: filmList, errorDelete: "Xóa phim thành công" });
    }
})

module.exports = managerRoute;
