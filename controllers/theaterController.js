var theaterModel=require('../models/theater');

const getTheater = async function(req, res){
    var areas=await theaterModel.getArea();
    var theaters=await theaterModel.getTheater();
    res.render('theater/index',{areas:encodeURIComponent(JSON.stringify(areas)),theaters:encodeURIComponent(JSON.stringify(theaters))});
}

module.exports = {
    getTheater
}