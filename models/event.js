var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');
var moment = require('moment');
exports.getEvent= async function(limit,offset)
{
    var deferred = Q.defer();
    var nowDate=new Date(moment()).toISOString().substring(0,10);
    var entity = {
        limit: limit,
        offset: offset
    };
    console.log(entity);
    var promises = [];
    var sql_1;
    var sql_2;
    sql_1=`SELECT COUNT(DISTINCT SK.idsukien) as total from sukien as SK where ngaybatdau<='${nowDate}' and ngayketthuc>='${nowDate}'`;
    sql_2= `SELECT DISTINCT SK.* from sukien as SK where ngaybatdau<='${nowDate}' and ngayketthuc>='${nowDate}' LIMIT ${entity.limit} OFFSET ${entity.offset}`;
    console.log(sql_1,sql_2)
    promises.push(db.load(sql_1));
    promises.push(db.load(sql_2));
 
    Q.all(promises).spread(function(totalRow, rows) {
        var data = {
             total: totalRow[0].total,
             rows: rows
        }
        deferred.resolve(data);
    });
 
 
    return deferred.promise;
    
}
exports.getListEvents=async function()
{
    var nowDate=new Date(moment()).toISOString().substring(0,10);
    var listEventsQuery=`select * from sukien where ngaybatdau<='${nowDate}' and ngayketthuc>='${nowDate}'`;
    var listEvents=await db.load(listEventsQuery);
    return listEvents;
}
exports.getAllEvents=async function()
{
    
    var listEventsQuery=`select * from sukien`;
    var listEvents=await db.load(listEventsQuery);
    return listEvents;
}
exports.getEventById=async function(id)
{
    var detailEventQuery=`select * from sukien where idsukien=${id}`;
    var detailEvent=await db.load(detailEventQuery);
    return detailEvent[0];
}
exports.updateInfoEvent=async function(id,entity)
{

    var deferred = Q.defer();
    var sql = `update sukien 
    set tensukien = "${entity.tensukien}",noidung="${entity.noidung}",ngaybatdau="${entity.ngaybatdau}",
    ngayketthuc="${entity.ngayketthuc}",hinhanh="${entity.hinhanh}"
    where idsukien =${id} `;
    var res=await db.load(sql);

    return res;
}
exports.isPresent=async function(id)
{
    var checkEventPresentQuery=`select * from sukien where ngaybatdau<=now() and ngayketthuc>=now() and idsukien=${id}`;
    var checkEventPresent=await db.load(checkEventPresentQuery);
    return checkEventPresent.length>0;
}
exports.deleteEventById=async function(id)
{

    var delEventQuery=`delete from sukien where idsukien=${id}`;
    var delEvent=await db.load(delEventQuery);
    return delEvent;
}
exports.addNewEvent=async function(entity)
{
    var newEventQuery=`insert into sukien (tensukien,noidung,ngaybatdau,ngayketthuc,hinhanh)
    values("${entity.tensukien}","${entity.noidung}","${entity.ngaybatdau}","${entity.ngayketthuc}","${entity.hinhanh}")`;
    var newEvent=db.load(newEventQuery);
    return newEvent;
}