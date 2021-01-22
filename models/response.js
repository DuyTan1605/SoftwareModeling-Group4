var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');
var moment = require('moment');
exports.getResponses= async function()
{
    var sql=`select * from phanhoi`;
    var listResponses=await db.load(sql);
   return listResponses;
    
}
exports.updateResponse=async function(id,entity)
{
    var responseQuery=`update phanhoi set noidunghoidap="${entity.noidunghoidap}",manguoiphanhoi=${entity.manguoiphanhoi},thoigianhoidap="${entity.thoigianhoidap}"
    where id=${id}`;
    console.log(responseQuery);
    var response=await db.load(responseQuery);
    return response;
}
