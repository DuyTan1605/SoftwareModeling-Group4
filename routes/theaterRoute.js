var express = require('express');
var theaterRoute = express.Router();
var theaterModel=require('../models/theater');
theaterRoute.get('/', async function(req, res){
    var areas=await theaterModel.getArea();
    var theaters=await theaterModel.getTheater();
    res.render('theater/index',{areas:encodeURIComponent(JSON.stringify(areas)),theaters:encodeURIComponent(JSON.stringify(theaters))});
})
module.exports=theaterRoute;