var express = require('express');
var jsonUtils = require('../app-helpers/json_utils');
var bookRoute = express.Router();
var bookModel = require('../models/book');
var accountModel = require('../models/account');
var showTimeModel = require('../models/show-time');
var moment = require('moment');
// 'use strict';
// const storage = require('node-sessionstorage')
const dotenv = require("dotenv");
dotenv.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripe = require('stripe')(stripeSecretKey)
bookRoute.get("/", async function (req, res) {
    console.log(stripeSecretKey, stripePublicKey);
    var film = await showTimeModel.getShowTime();
    film = film.filter(function (x) {
        return x.giochieu == req.query.timeShow && x.idphim == req.query.idFilm && x.idphongchieu == req.query.idRoom && x.ngaychieu == req.query.dateShow;
    })
    console.log(film);
    var tickets = await bookModel.getTicket();
    var services = await bookModel.getFoodAndDrinks();
    //console.log(tickets,services);
    var seats = await bookModel.getAllReservedSeats(req.query.timeShow, req.query.idFilm, req.query.idRoom, req.query.dateShow, req.query.timeShow);

    res.render('book/newindex', {
        film: JSON.parse(JSON.stringify(film))[0],
        tickets: tickets, services: services,
        total_tickets: encodeURIComponent(JSON.stringify(tickets.length)),
        total_services: encodeURIComponent(JSON.stringify(services.length)),
        seats: encodeURIComponent(JSON.stringify(seats)),
        layoutModels: res.locals.layoutModels,
        stripePublicKey: encodeURIComponent(JSON.stringify(stripePublicKey)),
        idlichchieu: encodeURIComponent(JSON.stringify(film[0].idlichchieuphim)),
        idkhachhang: encodeURIComponent(JSON.stringify(res.locals.layoutModels.account.id)),
        diemcong: encodeURIComponent(JSON.stringify(res.locals.layoutModels.account.positivepoint))
    });
})


bookRoute.post('/purchase', async function (req, res) {
    var entity = {
        idkhachhang: req.body.idkhachhang,
        tongtien: req.body.amount,
        ngaydatve: new Date(moment()).toISOString().substring(0, 10),
        idlichchieuphim: req.body.idlichchieu,
        vitrighe: req.body.seats,
        luachon: req.body.arrChoices
    }
    console.log(req.body);
    var listChoices = entity.luachon.split(" + ");
    var newArrChoice = [];
    for (let i = 0; i < listChoices.length; i++) {
        let temp = {};
        // console.log(listChoices[i].toLowerCase());
        if (listChoices[i].toLowerCase().indexOf("vé") >= 0) {
            temp.type = 1;

        }
        else {
            temp.type = 2;
        }
        temp.soluong = parseInt(listChoices[i].slice(0, 1));
        temp.noidung = listChoices[i].slice(2);
        newArrChoice.push(temp);
    }
    let result = await bookModel.insert(entity);
    let idHistoryBooking = parseInt(await bookModel.getIdNewest());
    let updateHistoryTicket = await bookModel.insertChoices(idHistoryBooking, newArrChoice);
    let updatePoint = await accountModel.updateDiemCong({ "diem": parseInt(req.body.diemcong) + 1, "id": res.locals.layoutModels.account.id });
    //console.log(newArrChoice);
    console.log(entity);
    //var res=await bookModel.insert(entity);
    //console.log(req.body);
    stripe.charges.create({
        amount: req.body.amount,
        source: req.body.stripeTokenId,
        currency: 'vnd'
    }).then(function () {

        console.log('Charge successs!!!')
        res.json({ message: 'Successfully purchased items' })
    }).catch(function () {
        //res.redirect("/home");
        console.log('Charge Fail!!!')
        res.status(500).end()
    })

})
module.exports = bookRoute;   