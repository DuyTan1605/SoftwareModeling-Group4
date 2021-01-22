var Q = require('q');
var mustache = require('mustache');

var db = require('../app-helpers/dbHelper');
exports.getArea=async function()
{
    var listAreaQuery=mustache.render('select * from khuvuc');
    var listArea=await db.load(listAreaQuery);
    return listArea;
}
exports.getTheater=async function()
{
    var listTheaterQuery=`select RP.*,KV.*,COUNT(PC.idphongchieu) as SLPC from rapphim as RP,khuvuc as KV,phongchieu as PC 
    where RP.idkhuvuc=KV.idkhuvuc and PC.idrap=RP.idrap and PC.tinhtrang=1 GROUP BY RP.idrap`;
    var listTheater=await db.load(listTheaterQuery);
    return listTheater;
}