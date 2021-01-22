var Q = require('q');
var mustache = require('mustache');
var moment = require('moment');
var db = require('../app-helpers/dbHelper');
exports.getCinemaRoom=async function()
{
    var listCinemaRoomQuery=mustache.render(`select KV.tenkhuvuc,RP.tenrap,PC.tenphongchieu,PC.soluongghe,PC.idphongchieu
    from phongchieu as PC,khuvuc as KV ,rapphim as RP
    where PC.idrap=RP.idrap and RP.idkhuvuc=KV.idkhuvuc and PC.tinhtrang = 1`);
    var listCinemaRoom=await db.load(listCinemaRoomQuery);
    
    return listCinemaRoom;
}
exports.isExistCinemaRoom=async function(id)
{
    var isExistCinemaRoomQuery = mustache.render(`select * from lichsudatve,lichchieuphim 
    where lichchieuphim.idphongchieu=${id} and lichsudatve.idlichchieuphim=lichchieuphim.idlichchieuphim`);
    var isExistCinemaRoom=await db.load(isExistCinemaRoomQuery);
    return isExistCinemaRoom.length>0?true:false;
}
exports.deleteCinemaRoomDetail=async function(id)
{
    var updateStatusQuery = `update phongchieu set tinhtrang = 0 where idphongchieu = ${id}`;
    var updateStatus = await db.load(updateStatusQuery);
    return updateStatus;
}
exports.getCinemaRoomById=async function(id){
    var cinemaRoomDetailQuery = mustache.render(`select KV.tenkhuvuc,RP.tenrap, PC.soluongghe, PC.tenphongchieu, PC.idphongchieu
    from khuvuc as KV, rapphim as RP, phongchieu as PC
    where KV.idkhuvuc=RP.idkhuvuc and PC.idrap=RP.idrap and PC.idphongchieu=${id}`);
    var cinemaRoomDetai=await db.load(cinemaRoomDetailQuery);
    return cinemaRoomDetai[0];
}
exports.updateInfoCinemaRoom=async function(id,entity){
   // console.log(entity);
    var sql = `update phongchieu 
    set tenphongchieu ="${entity.tenphongchieu}",soluongghe=${entity.soluongghe}
    where idphongchieu = ${id}`;
    var res=await db.load(sql);
    return res;
}
exports.isExistsCinemaRoom=async function(entity)
{
    var checkQuery=mustache.render(`select * from phongchieu,khuvuc,rapphim where khuvuc.idkhuvuc=rapphim.idkhuvuc 
    and khuvuc.idkhuvuc={{idkhuvuc}} and rapphim.idrap={{idrap}} and phongchieu.idrap={{idrap}}
    and phongchieu.tenphongchieu="{{tenphongchieu}} and phongchieu.tinhtrang=1"`,entity);
    var check=await db.load(checkQuery);
    console.log(check);
    return check.length>0?true:false;
}
exports.addCinemaRoom=async function(entity)
{
    var addCinemaRoomQuery=mustache.render(`insert into phongchieu (tenphongchieu,soluongghe,idrap,tinhtrang)
    values ("{{tenphongchieu}}",{{soluongghe}},{{idrap}},1)`,entity);
    var addCinemaRoom=await db.load(addCinemaRoomQuery);
    return addCinemaRoom;
}
exports.checkEditCinemaRoom=async function(entity){
    var checkQuery=`select * from phongchieu as PC, rapphim as RP
     where RP.idrap=PC.idrap and PC.tenphongchieu="${entity.tenphongchieu}" and RP.tenrap="${entity.tenrap}"`;
    var check=await db.load(checkQuery);
    return check.length>0 ?true:false;
}