var express = require('express');
var bookTicketRoute = express.Router();
var film=require('../models/film');
var showTime=require('../models/show-time');
bookTicketRoute.get("/",async function(req,res)
{
    
    var showTimeFilm=await showTime.getShowTimeByIdFilm(parseInt(req.query.id));
    var filmDetail=await film.getFilmById(parseInt(req.query.id));
    var areas=await showTime.getArea();
    console.log(showTimeFilm);
    res.render('bookticket/index',{areas:encodeURIComponent(JSON.stringify(areas)),showTimeFilm:encodeURIComponent(JSON.stringify(showTimeFilm)),film:filmDetail[0]});
})
module.exports=bookTicketRoute;