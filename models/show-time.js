var Q = require('q');
var mustache = require('mustache');
var moment = require('moment');
var db = require('../app-helpers/dbHelper');
exports.getArea=async function()
{
    var listAreaQuery=mustache.render('select * from khuvuc');
    var listArea=await db.load(listAreaQuery);
    return listArea;
}
exports.getTheater=async function()
{
    var listTheaterQuery=mustache.render('select RP.*,KV.tenkhuvuc from khuvuc AS KV,rapphim as RP where RP.idkhuvuc=KV.idkhuvuc');
    var listTheater=await db.load(listTheaterQuery);
    return listTheater;
}
exports.getShowTime=async function()
{
    var listShowTimeQuery=mustache.render(`select LCP.*,KV.tenkhuvuc,RP.tenrap,PC.tenphongchieu,P.tenphim,P.hinhanh,RP.idrap
    from lichchieuphim as LCP,phongchieu as PC,khuvuc as KV ,phim as P,rapphim as RP
    where LCP.idphim=P.idphim and LCP.idphongchieu=PC.idphongchieu and PC.idrap=RP.idrap and RP.idkhuvuc=KV.idkhuvuc`);
    var listShowTime=await db.load(listShowTimeQuery);
    return listShowTime;
}
exports.getShowTimeByIdFilm=async function(id)
{
    var date=new Date();
    //var nowDate=date.getFullYear()+"-"+((date.getMonth()+1)>=10?(date.getMonth()+1):"0"+(date.getMonth()+1))+"-"+(date.getDate()>=10?date.getDate():"0"+date.getDate());
    var nowDate=new Date(moment()).toISOString().substring(0,10);
    console.log(nowDate);
    var showTimeFilmQuery=`select LCP.*,P.tenphim,PC.tenphongchieu,RP.tenrap,KV.tenkhuvuc,LCP.giochieu,P.hinhanh,RP.diachi,RP.idrap
    from lichchieuphim as LCP,phim as P,phongchieu as PC,rapphim as RP,khuvuc as KV
    where LCP.idphim=P.idphim and LCP.idphongchieu=PC.idphongchieu and 
    PC.idrap=RP.idrap and RP.idkhuvuc=kv.idkhuvuc and LCP.idphim=${id} and LCP.ngaychieu>="${nowDate}"`;
    var showTimeFilm=await db.load(showTimeFilmQuery);
    return showTimeFilm;
}
exports.getShowTimeById=async function(id)
{
    var showTimeQuery=mustache.render(`select LCP.*,KV.tenkhuvuc,RP.tenrap,PC.tenphongchieu,P.tenphim,P.hinhanh,RP.idrap
    from lichchieuphim as LCP,phongchieu as PC,khuvuc as KV ,phim as P,rapphim as RP
    where LCP.idphim=P.idphim and LCP.idphongchieu=PC.idphongchieu and PC.idrap=RP.idrap and RP.idkhuvuc=KV.idkhuvuc and LCP.idlichchieuphim=${id}`);
    var showTime=await db.load(showTimeQuery);
    return showTime;
}
exports.isExistsShowTime=async function(entity)
{
    var checkQuery=mustache.render(`select * from lichchieuphim where idphim={{idphim}} and idphongchieu={{idphongchieu}}
    and ngaychieu="{{ngaychieu}}" and giochieu="{{giochieu}}"`,entity);
    var check=await db.load(checkQuery);
    console.log(check);
    return check.length>0?true:false;
}
exports.addShowTime=async function(entity)
{
    var addShowTimeQuery=`insert into lichchieuphim (idphim,idphongchieu,ngaychieu,giochieu)
    values (${entity.idphim},${entity.idphongchieu},"${entity.ngaychieu}","${entity.giochieu}")`;
    var addShowTime=await db.load(addShowTimeQuery);
    return addShowTime;
}
exports.editShowTimeDetail= async function(entity)
{
    var editQuery=`update lichchieuphim set idphongchieu=${entity.idphongchieu},ngaychieu="${entity.ngaychieu}",giochieu="${entity.giochieu}" where idlichchieuphim=${entity.idlichchieuphim}`;
    var edit=await db.load(editQuery);
    return edit;
}
exports.deleteShowTimeDetail=async function(id)
{
    var delQuery=`delete from lichchieuphim where idlichchieuphim=${id}`;
    var delRes=await db.load(delQuery);
    return delRes;
}
