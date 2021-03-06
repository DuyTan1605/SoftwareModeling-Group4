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
managerRoute.get("/event", async function (req, res) {
    var listEvents = await eventModel.getAllEvents();
    res.render("manager/event/index", { listEvents: listEvents, errorDelete: req.session.errorDelete });
    delete req.session.errorDelete;
});
managerRoute.get("/editEvent", async function (req, res) {
    var detailEvent = await eventModel.getEventById(parseInt(req.query.id));
    console.log(detailEvent);
    res.render('manager/event/edit', { event: detailEvent });
})


managerRoute.post('/editEvent', function (req, res) {
    //console.log(req.file,req.body);
    const upload1 = multer({ storage }).single('eventImage');
    var temp;
    upload1(req, res, async function (err) {
        if (err) {
            return res.send(err)
        }
        console.log('file uploaded to server')
        console.log(req.file || "no")
        console.log(req.body.temp_eventImage)
        // SEND FILE TO CLOUDINARY

        if (!req.file) {



            var entity = {
                idsukien: req.body.eventId,
                tensukien: req.body.eventName,
                ngaybatdau: req.body.dateStart,
                ngayketthuc: req.body.dateEnd,
                noidung: req.body.eventSummary,
                hinhanh: req.body.temp_eventImage
            }
            // console.log(entity);
            var result = await eventModel.updateInfoEvent(parseInt(req.body.eventId), entity);

            if (result.changedRows > 0) {

                res.render(`manager/event/edit`, { event: entity, errorEdit: "Cập nhật thông tin sự kiện thành công" });

            }
            else {

                res.render(`manager/event/edit`, { event: entity, errorEdit: "Cập nhật thông tin sự kiện thất bại" });

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
                    idsukien: req.body.eventId,
                    tensukien: req.body.eventName,
                    ngaybatdau: req.body.dateStart,
                    ngayketthuc: req.body.dateEnd,
                    noidung: req.body.eventSummary,
                    hinhanh: image.url
                }
                // console.log(entity);
                var result = await eventModel.updateInfoEvent(parseInt(req.body.eventId), entity);

                if (result.changedRows > 0) {

                    res.render(`manager/event/edit`, { event: entity, errorEdit: "Cập nhật thông tin sự kiện thành công" });

                }
                else {

                    res.render(`manager/event/edit`, { event: entity, errorEdit: "Cập nhật thông tin sự kiện thất bại" });

                }
            }
        )
    })




})

managerRoute.post("/event/delete", async function (req, res) {
    var isPresentEvent = await eventModel.isPresent(parseInt(req.body.eventId));
    console.log(film.isPresentEvent);
    if (isPresentEvent) {
        // req.session.errorDelete = 'Sự kiện đang diễn ra';
        // res.redirect('/manager/event');
        var listEvents = await eventModel.getAllEvents();
        res.render('manager/event/index', { listEvents: listEvents, errorDelete: 'Sự kiện đang diễn ra' });
    }
    else {
        var delEvent = await eventModel.deleteEventById(parseInt(req.body.eventId));
        // req.session.errorDelete = 'Xóa sự kiện thành công';
        // res.redirect('/manager/event');
        var listEvents = await eventModel.getAllEvents();
        res.render('manager/event/index', { listEvents: listEvents, errorDelete: 'Xóa sự kiện thành công' });
    }
});

managerRoute.get("/addEvent", function (req, res) {
    res.render("manager/event/add");
})

managerRoute.post("/addEvent", function (req, res) {
    const upload1 = multer({ storage }).single('eventImage');
    var temp;
    upload1(req, res, function (err) {
        if (err) {
            return res.send(err)
        }
        console.log('file uploaded to server')
        console.log(req.file)

        // SEND FILE TO CLOUDINARY


        const path = req.file.path
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
                    tensukien: req.body.eventName,
                    ngaybatdau: req.body.dateStart,
                    ngayketthuc: req.body.dateEnd,
                    noidung: req.body.eventSummary,
                    hinhanh: image.url
                }
                console.log(req.file);
                console.log(entity);
                var result = await eventModel.addNewEvent(entity);
                res.render("manager/event/add", { errorAdd: "Thêm sự kiện thành công" });
                delete req.session.errorAdd;
            }
        )
    })
});

managerRoute.get("/service", async function (req, res) {
    var listServices = await serviceModel.getListServices();
    res.render("manager/service/index", { listServices: listServices, errorDelete: req.session.errorDelete });
    delete req.session.errorDelete;
});

managerRoute.get("/ticket", async function (req, res) {
    var listTickets = await ticketModel.getListTickets();
    res.render("manager/ticket/index", { listTickets: listTickets, errorDelete: req.session.errorDelete });
    delete req.session.errorDelete;
});

managerRoute.get("/editService", async function (req, res) {
    var detailService = await serviceModel.getServiceById(parseInt(req.query.id));
    res.render('manager/service/edit', { service: detailService });
})


managerRoute.post("/editService", async function (req, res) {
    console.log(req.body);
    var entity = {
        iddichvu: req.body.serviceId,
        tendichvu: req.body.serviceName,
        gia: req.body.servicePrice
    }
    var result = await serviceModel.updateInfoService(parseInt(req.body.serviceId), entity);

    if (result.changedRows > 0) {

        res.render(`manager/service/edit`, { service: entity, errorEdit: "Cập nhật thông tin dịch vụ thành công" });

    }
    else {

        res.render(`manager/service/edit`, { service: entity, errorEdit: "Cập nhật thông tin dịch vụ thất bại" });

    }
})


managerRoute.get("/editTicket", async function (req, res) {
    var detailTicket = await ticketModel.getTicketById(parseInt(req.query.id));
    //console.log(detailTicket);
    res.render('manager/ticket/edit', { ticket: detailTicket });
})

managerRoute.post("/editTicket", async function (req, res) {
    console.log(req.body);
    var entity = {
        idve: req.body.ticketId,
        tenve: req.body.ticketName,
        giave: parseInt(req.body.ticketPrice)
    }
    var result = await ticketModel.updateInfoTicket(parseInt(req.body.ticketId), entity);

    if (result.changedRows > 0) {

        res.render(`manager/ticket/edit`, { ticket: entity, errorEdit: "Cập nhật thông tin vé thành công" });

    }
    else {

        res.render(`manager/ticket/edit`, { ticket: entity, errorEdit: "Cập nhật thông tin vé thất bại" });

    }
})

managerRoute.post("/service/delete", async function (req, res) {
    var entity = {
        iddichvu: req.body.serviceId,
        tinhtrang: parseInt(req.body.serviceType) == 1 ? 0 : 1
    }

    var result = await serviceModel.updateStatusService(parseInt(req.body.serviceId), entity);
    var services = await serviceModel.getListServices();
    //req.session.errorDelete="Cập nhật trạng thái dịch vụ thành công";
    res.render("manager/service/index", { errorDelete: "Cập nhật trạng thái dịch vụ thành công", listServices: services });
})

managerRoute.post("/ticket/delete", async function (req, res) {
    var entity = {
        idve: req.body.ticketId,
        tinhtrang: parseInt(req.body.ticketType) == 1 ? 0 : 1
    }

    var result = await ticketModel.updateStatusTicket(parseInt(req.body.ticketId), entity);
    var tickets = await ticketModel.getListTickets();
    //req.session.errorDelete="Cập nhật trạng thái vé thành công";
    res.render("manager/ticket/index", { errorDelete: "Cập nhật trạng thái vé thành công", listTickets: tickets });
})


managerRoute.get("/addService", function (req, res) {
    res.render("manager/service/add", { errorAdd: req.session.errorAdd });
})
managerRoute.post("/addService", async function (req, res) {
    var entity = {
        tendichvu: req.body.serviceName,
        gia: parseInt(req.body.servicePrice)
    }
    var result = await serviceModel.addNewService(entity);
    res.render("manager/service/add", { errorAdd: "Thêm dịch vụ thành công" });
    delete req.session.errorAdd;
})

managerRoute.get("/addTicket", function (req, res) {
    res.render("manager/ticket/add", { errorAdd: req.session.errorAdd });
})


managerRoute.post("/addTicket", async function (req, res) {
    var entity = {
        tenve: req.body.ticketName,
        gia: parseInt(req.body.ticketPrice)
    }
    var result = await ticketModel.addNewTicket(entity);
    res.render("manager/ticket/add", { errorAdd: "Thêm vé thành công" });
    delete req.session.errorAdd;
})


managerRoute.get("/response", async function (req, res) {
    var responses = await responseModel.getResponses();
    console.log(responses);
    res.render("manager/response/index", { responses: responses, errorResponse: req.session.errorResponse });
    delete req.session.errorResponse;
})
managerRoute.post("/response", async function (req, res) {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/" + (currentdate.getMonth() + 1)
        + "/" + currentdate.getFullYear() + " - "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    var entity = {
        noidunghoidap: req.body.responseContent,
        manguoiphanhoi: parseInt(res.locals.layoutModels.account.id),
        thoigianhoidap: datetime
    }
    // console.log(req.body);
    var result = await responseModel.updateResponse(parseInt(req.body.responseId), entity);
    req.session.errorResponse = "Trả lời phản hồi thành công";
    res.redirect("/manager/response");

});

managerRoute.get("/bookTicket", async function (req, res) {
    var listBooking = await account.loadAllHistoryBooking();
    //console.log(listBooking);
    res.render("manager/historyBooking/index", { lists: listBooking, errorDelete: req.session.errorDelete });
    delete req.session.errorDelete;
})

managerRoute.post("/book/delete", async function (req, res) {
    var entity = {
        idlichsudatve: req.body.serviceId,
        tinhtrang: parseInt(req.body.serviceType) == 1 ? 0 : 1
    }

    var result = await bookModel.updateHistoryTicket(parseInt(req.body.serviceId), entity);
    req.session.errorDelete = "Cập nhật trạng thái vé thành công";
    res.redirect("/manager/bookTicket");
})

managerRoute.get("/timeShow", async function (req, res) {
    var listShowTimes = await showTimeModel.getShowTime();
    res.render("manager/timeShow/index", { listShowTimes: listShowTimes });
    //delete req.session.errorDelete;
})

managerRoute.post("/showTime/delete", async function (req, res) {
    var isReserved = await bookModel.isReservated(parseInt(req.body.showTimeId));
    // console.log(isReserved);
    if (isReserved) {
        var listShowTimes = await showTimeModel.getShowTime();
        res.render("manager/timeShow/index", { listShowTimes: listShowTimes, errorDelete: "Đã có khách hàng đặt lịch" });
        // req.session.errorDelete="Đã có khách hàng đặt lịch";
        // res.redirect("/manager/timeShow");
    }
    else {
        var temp = await showTimeModel.deleteShowTimeDetail(parseInt(req.body.showTimeId));
        var listShowTimes = await showTimeModel.getShowTime();
        res.render("manager/timeShow/index", { listShowTimes: listShowTimes, errorDelete: "Xóa lịch chiếu thành công" });

        // req.session.errorDelete="Xóa lịch chiếu thành công";
        // res.redirect("/manager/timeShow");
    }
})
managerRoute.get("/editShowTime", async function (req, res) {
    console.log(parseInt(req.query.id));
    var showTimeDetail = await showTimeModel.getShowTimeById(parseInt(req.query.id));

    var listArea = await helperModel.getAllArea();
    var listTheater = await helperModel.getListTheater();
    var listRoom = await helperModel.getListRoom();

    res.render("manager/timeShow/edit", { film: showTimeDetail[0], listArea: encodeURIComponent(JSON.stringify(listArea)), filmDetail: encodeURIComponent(JSON.stringify(showTimeDetail[0])), listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });
    delete req.session.errorEdit;
})
managerRoute.post("/editShowTime", async function (req, res) {
    //console.log(req.body);
    var entity = {
        idlichchieuphim: parseInt(req.body.showTimeId),
        idphongchieu: parseInt(req.body.rooms),
        ngaychieu: req.body.datePublic,
        giochieu: req.body.appt

    };
    //  console.log(entity);
    var result = await showTimeModel.editShowTimeDetail(entity);
    var showTimeDetail = await showTimeModel.getShowTimeById(parseInt(entity.idlichchieuphim));

    var listArea = await helperModel.getAllArea();
    var listTheater = await helperModel.getListTheater();
    var listRoom = await helperModel.getListRoom();

    res.render("manager/timeShow/edit", { errorEdit: "Chỉnh sửa thông tin lịch chiếu thành công", film: showTimeDetail[0], listArea: encodeURIComponent(JSON.stringify(listArea)), filmDetail: encodeURIComponent(JSON.stringify(showTimeDetail[0])), listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });
    delete req.session.errorEdit;
    // req.session.errorEdit="Chỉnh sửa thông tin lịch chiếu thành công";
    // res.redirect("/manager/editShowTime?id="+entity.idlichchieuphim);
})
managerRoute.get("/addShowTime", async function (req, res) {
    var presentList = await helperModel.getPresentList();
    var listArea = await helperModel.getAllArea();
    var listTheater = await helperModel.getListTheater();
    var listRoom = await helperModel.getListRoom();
    res.render("manager/timeShow/add", { presentList: presentList, listArea: listArea, listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });
    delete req.session.errorAdd;
})

managerRoute.post("/addShowTime", async function (req, res) {
    var entity = {
        idphim: parseInt(req.body.films),
        ngaychieu: req.body.datePublic,
        giochieu: req.body.appt,
        idphongchieu: parseInt(req.body.rooms),
    };
    console.log(entity);
    var isExists = await showTimeModel.isExistsShowTime(entity);

    console.log(isExists);
    if (isExists) {
        var presentList = await helperModel.getPresentList();
        var listArea = await helperModel.getAllArea();
        var listTheater = await helperModel.getListTheater();
        var listRoom = await helperModel.getListRoom();
        res.render("manager/timeShow/add", { errorAdd: "Lịch chiếu đã tồn tại", presentList: presentList, listArea: listArea, listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });
        // req.session.errorAdd="Lịch chiếu đã tồn tại";
        // res.redirect("/manager/addShowTime");

    }
    else {
        showTimeModel.addShowTime(entity);
        var presentList = await helperModel.getPresentList();
        var listArea = await helperModel.getAllArea();
        var listTheater = await helperModel.getListTheater();
        var listRoom = await helperModel.getListRoom();
        res.render("manager/timeShow/add", { errorAdd: "Thêm lịch chiếu thành công", presentList: presentList, listArea: listArea, listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });
        // req.session.errorAdd="Thêm lịch chiếu thành công";
        // res.redirect("/manager/addShowTime");

    }
})
managerRoute.get("/cinemaRoom", async function (req, res) {
    var listCinemaRooms = await cinemaRoomModel.getCinemaRoom();
    res.render("manager/cinemaRoom/index", { listCinemaRooms: listCinemaRooms });
    delete req.session.errorDelete;

})
managerRoute.post("/cinemaRoom/delete", async function (req, res) {
    var isExistCinemaRoom = await cinemaRoomModel.isExistCinemaRoom(parseInt(req.body.cinemaRoomId));
    if (isExistCinemaRoom) {
        var listCinemaRooms = await cinemaRoomModel.getCinemaRoom();
        res.render("manager/cinemaRoom/index", { listCinemaRooms: listCinemaRooms, errorDelete: "Đã có khách hàng đặt lịch" });

        // req.session.errorDelete="Đã có khách hàng đặt lịch";
        // res.redirect("/manager/cinemaRoom");
    }
    else {
        var res1 = await cinemaRoomModel.deleteCinemaRoomDetail(parseInt(req.body.cinemaRoomId));
        var listCinemaRooms = await cinemaRoomModel.getCinemaRoom();
        res.render("manager/cinemaRoom/index", { listCinemaRooms: listCinemaRooms, errorDelete: "Xóa phòng chiếu thành công" });
        // req.session.errorDelete="Xóa phòng chiếu thành công";
        // res.redirect("/manager/cinemaRoom");
    }
})
managerRoute.get("/editCinemaRoom", async function (req, res) {

    var cinemaRoomDetail = await cinemaRoomModel.getCinemaRoomById(parseInt(req.query.id));
    var listRoom = await helperModel.getListRoomByName();
    //console.log(cinemaRoomDetail,listRoom);
    listRoom = listRoom.map(function (x) {
        if (x.tenphongchieu == cinemaRoomDetail.tenphongchieu) {
            return {
                tenphongchieu: x.tenphongchieu,
                checked: 1
            };
        }
        return {
            tenphongchieu: x.tenphongchieu,
            checked: 0
        };
    })
    //console.log(listRoom);
    res.render('manager/cinemaRoom/edit', { cinemaRoom: cinemaRoomDetail, listRoom: listRoom });
    delete req.session.errorEdit;
})
managerRoute.post('/editCinemaRoom', async function (req, res) {
    var entity = {
        tenkhuvuc: req.body.area,
        tenrap: req.body.theater,
        idphongchieu: req.body.RoomID,
        tenphongchieu: req.body.rooms,
        soluongghe: req.body.RoomChair,
    }
    var cinemaRoomDetail = await cinemaRoomModel.getCinemaRoomById(parseInt(entity.idphongchieu));
    //console.log(entity);
    var checkEdit = false;
    if (cinemaRoomDetail.tenphongchieu != entity.tenphongchieu) {
        var checkEdit = await cinemaRoomModel.checkEditCinemaRoom(entity);
    }

    //console.log(checkEdit);
    if (checkEdit) {
        var cinemaRoomDetail = await cinemaRoomModel.getCinemaRoomById(parseInt(req.body.RoomID));
        var listRoom = await helperModel.getListRoomByName();
        //console.log(cinemaRoomDetail,listRoom);
        listRoom = listRoom.map(function (x) {
            if (x.tenphongchieu == cinemaRoomDetail.tenphongchieu) {
                return {
                    tenphongchieu: x.tenphongchieu,
                    checked: 1
                };
            }
            return {
                tenphongchieu: x.tenphongchieu,
                checked: 0
            };
        })
        res.render('manager/cinemaRoom/edit', { cinemaRoom: cinemaRoomDetail, listRoom: listRoom, errorEdit: "Phòng chiếu đã tồn tại" });
    }
    else {
        var res1 = await cinemaRoomModel.updateInfoCinemaRoom(parseInt(req.body.RoomID), entity);
        var cinemaRoomDetail = await cinemaRoomModel.getCinemaRoomById(parseInt(req.body.RoomID));
        var listRoom = await helperModel.getListRoomByName();
        //console.log(cinemaRoomDetail,listRoom);
        listRoom = listRoom.map(function (x) {
            if (x.tenphongchieu == cinemaRoomDetail.tenphongchieu) {
                return {
                    tenphongchieu: x.tenphongchieu,
                    checked: 1
                };
            }
            return {
                tenphongchieu: x.tenphongchieu,
                checked: 0
            };
        })
        res.render('manager/cinemaRoom/edit', { cinemaRoom: cinemaRoomDetail, listRoom: listRoom, errorEdit: "Chỉnh sửa thông tin phòng chiếu thành công" });
        // req.session.errorEdit="Chỉnh sửa thông tin phòng chiếu thành công";
        // res.redirect("/manager/editCinemaRoom?id="+entity.idphongchieu);
    }


})
managerRoute.get("/addCinemaRoom", async function (req, res) {

    var listArea = await helperModel.getAllArea();
    var listTheater = await helperModel.getListTheater();
    var listRoom = await helperModel.getListRoomByName();
    res.render("manager/CinemaRoom/add", { listArea: listArea, listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });
    //delete req.session.errorAdd;
})
managerRoute.post("/addCinemaRoom", async function (req, res) {
    var entity = {
        idkhuvuc: req.body.areas,
        idrap: req.body.theaters,
        tenphongchieu: req.body.rooms,
        soluongghe: req.body.RoomChair,
    };
    console.log(entity);
    var isExists = await cinemaRoomModel.isExistsCinemaRoom(entity);

    console.log(isExists);
    if (isExists) {

        var listArea = await helperModel.getAllArea();
        var listTheater = await helperModel.getListTheater();
        var listRoom = await helperModel.getListRoomByName();
        res.render("manager/CinemaRoom/add", { errorAdd: "Phòng chiếu đã tồn tại", listArea: listArea, listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });
    }
    else {
        cinemaRoomModel.addCinemaRoom(entity);
        var listArea = await helperModel.getAllArea();
        var listTheater = await helperModel.getListTheater();
        var listRoom = await helperModel.getListRoomByName();
        res.render("manager/CinemaRoom/add", { errorAdd: "Thêm phòng chiếu thành công", listArea: listArea, listTheater: encodeURIComponent(JSON.stringify(listTheater)), listRoom: encodeURIComponent(JSON.stringify(listRoom)) });

    }
})
managerRoute.get("/report", async function (req, res) {
    res.render("manager/report");
})
managerRoute.post("/report", async function (req, res) {
    var filmRevenue = await reportModel.getFilmRevenue(req.body.years, req.body.months);
    let totalRevenue = await reportModel.getTotalRevenue(req.body.years, req.body.months);
    var arrModel = [];
    var month = parseInt(req.body.years) == new Date().getFullYear() ? new Date().getMonth() + 1 : 12;

    for (let i = 1; i <= month; i++) {
        let temp = await reportModel.getTotalRevenue(req.body.years, i);
        arrModel.push({ x: i, y: temp });
    }
    console.log(arrModel);
    res.render("manager/report/revenue", { filmRevenue: filmRevenue, totalRevenue: totalRevenue, arrModel: encodeURIComponent(JSON.stringify(arrModel)) });
})
module.exports = managerRoute;