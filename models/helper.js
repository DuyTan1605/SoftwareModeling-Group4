var Q = require('q');
var mustache = require('mustache');

var db = require('../app-helpers/dbHelper');
exports.getIdTicket=async function(name)
{
    var ticketIdQuery=`select V.idve as id from ve as V where V.tenve="${name}"`;
    console.log(ticketIdQuery);
    var ticketId=await db.load(ticketIdQuery);
    return parseInt(ticketId[0].id);
}
exports.getIdService=async function(name)
{
    var serviceIdQuery=`select DV.iddichvu as id from dichvu as DV where DV.tendichvu="${name}"`;
    var serviceId=await db.load(serviceIdQuery);
    return parseInt(serviceId[0].id);
}
exports.getAllType=async function()
{
    var typeQuery=`select TL.* from theloai as TL`;
    var typeResult=await db.load(typeQuery);
    return typeResult.cate;
}
exports.getMaxId=async function()
{
    var maxIdQuery=`select MAX(P.idphim) as idnow from phim as P`;
    var maxId=await db.load(maxIdQuery);
    return parseInt(maxId[0].idnow);
}
exports.getPresentList=async function()
{
    var presentListQuery=`select * from phim where tinhtrang=0`;
    var presentList=await db.load(presentListQuery);
    return presentList;
}
exports.getAllArea=async function()
{
    var listAreaQuery=`select * from khuvuc`;
    var listArea=await db.load(listAreaQuery);
    return listArea;
}
exports.getListTheater=async function()
{
    var listTheaterQuery=`select RP.*,KV.tenkhuvuc from rapphim as RP,khuvuc as KV where RP.idkhuvuc=KV.idkhuvuc`;
    var listTheater=await db.load(listTheaterQuery);
    return listTheater;
}
// exports.getListTimeShow=async function()
// {
//     var listTimeShowQuery=`select * from lichchieu`;
//     var listTimeShow=await db.load(listTimeShowQuery);
//     return listTimeShow;
// }
exports.getListRoom=async function()
{
    var listRoomQuery=`select PC.*,RP.tenrap from phongchieu as PC,rapphim as RP  where PC.idrap=RP.idrap`;
    var listRoom=await db.load(listRoomQuery);
    return listRoom;
}
exports.getListRoomByName=async function()
{
    var listRoomQuery=`select distinct tenphongchieu from phongchieu`;
    var listRoom=await db.load(listRoomQuery);
    return listRoom;
}
