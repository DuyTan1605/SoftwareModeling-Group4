var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');
var moment = require('moment');
exports.getListServices= async function()
{
   var listServicesQuery=`select * from dichvu`;
    var listServices=await db.load(listServicesQuery);
    return listServices;
}
exports.getServiceById=async function(id)
{
    var detailServiceQuery=`select * from dichvu where iddichvu=${id}`;
    var detailService=await db.load(detailServiceQuery);
    return detailService[0];
}
exports.updateInfoService=async function(id,entity)
{

    var deferred = Q.defer();
    var sql =`update dichvu 
    set tendichvu = "${entity.tendichvu}",gia=${entity.gia}
    where iddichvu =${id} `
    
    var res=await db.load(sql);

    return res;
}
exports.updateStatusService=async function(id,entity)
{
    var deferred = Q.defer();
    var sql = mustache.render(`update dichvu 
    set tinhtrang = "{{tinhtrang}}"
    where iddichvu = `
     + id, entity);
    var res=await db.load(sql);

    return res;
}
exports.addNewService=async function(entity)
{
    var newServiceQuery=`insert into dichvu (tendichvu,gia,tinhtrang) values("${entity.tendichvu}",${entity.gia},1)`;
    var newService=db.load(newServiceQuery);
    return newService;
}
