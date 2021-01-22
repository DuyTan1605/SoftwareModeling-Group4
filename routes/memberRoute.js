var express = require('express');
var memberRoute = express.Router();
memberRoute.get('/', function(req, res){
    res.render('member/index');
})
module.exports=memberRoute;