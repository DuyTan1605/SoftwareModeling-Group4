var express = require('express');
var showTimeRoute = express.Router();
var showTimeModel=require('../models/show-time');
showTimeRoute.get('/', async function(req, res){
   
    var areas=await showTimeModel.getArea();
    var theaters= await showTimeModel.getTheater();
    var showTimes=await showTimeModel.getShowTime();
    res.render('showTime/index',{areas:encodeURIComponent(JSON.stringify(areas)),theaters:encodeURIComponent(JSON.stringify(theaters)),showTimes:encodeURIComponent(JSON.stringify(showTimes))});
})
module.exports=showTimeRoute;