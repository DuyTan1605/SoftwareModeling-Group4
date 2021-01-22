var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');
var helper=require('../models/helper');
exports.getTicket=async function()
{
    var ticketListQuery='select * from ve where tinhtrang=1';
    var ticketList=await db.load(ticketListQuery);
    
   
    return ticketList;
}
exports.getFoodAndDrinks=async function()
{
    var listFoodAndDrinksQuery='select * from dichvu where tinhtrang=1';
    var listFoodAndDrinks=await db.load(listFoodAndDrinksQuery);
    return listFoodAndDrinks;
}
exports.getAllReservedSeats=async function(timeShow,idFilm,idRoom,dateShow,timeShow)
{
    var listReservedSeatQuery=`select LS.vitrighe as vitrighe from lichsudatve as LS,lichchieuphim as LCP
     where LS.idlichchieuphim=LCP.idlichchieuphim and LCP.idphim=${idFilm} and LCP.idphongchieu=${idRoom}
    and LCP.ngaychieu="${dateShow}" and LCP.giochieu="${timeShow}"`;
    //console.log(listReservedSeatQuery);
    var listReservedSeat=await db.load(listReservedSeatQuery);
    if(listReservedSeat.length>0)
    {
        return listReservedSeat;
    }
    return [];
   
}
exports.insert = async function(entity) {

    var deferred = Q.defer();
    var sql =`insert into lichsudatve (idkhachhang,tongtien,ngaydatve,idlichchieuphim,vitrighe) values (${entity.idkhachhang},
                ${entity.tongtien},"${entity.ngaydatve}",${entity.idlichchieuphim},"${entity.vitrighe}")`;
    
    
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}
exports.insertChoices=async function(id,arrChoice)
{
    for(let i=0;i<arrChoice.length;i++)
    {
        let temp={};
        temp.id=id;
        temp.soluong=arrChoice[i].soluong;
        console.log(arrChoice[i].noidung);
        if(arrChoice[i].type==1)
        {
            temp.idve=await helper.getIdTicket(arrChoice[i].noidung);
            console.log(temp.idve);
            let res=await db.load(`insert into lichsu_ve (idlichsu,idve,soluong) values (${temp.id},${temp.idve},${temp.soluong})`);
        }
        if(arrChoice[i].type==2)
        {
            temp.iddichvu=await helper.getIdService(arrChoice[i].noidung);
            let res=await db.load(`insert into lichsu_dichvu (idlichsu,iddichvu,soluong) values (${temp.id},${temp.iddichvu},${temp.soluong})`);
        }
    }
}
exports.getIdNewest=async function()
{
    var idNewestQuery=mustache.render('select MAX(LS.idlichsudatve) as id from lichsudatve as LS');
    var idNewest=await db.load(idNewestQuery);
    //console.log(idNewest);
    return idNewest[0].id;
}
exports.updateHistoryTicket=async function(id,entity)
{
    var deferred = Q.defer();
    var sql = mustache.render(`update lichsudatve
    set tinhtrang = "{{tinhtrang}}"
    where idlichsudatve = `
     + id, entity);
    var res=await db.load(sql);

    return res;
}
exports.isReservated=async function(id)
{
    var isReservatedQuery=`select * from lichsudatve where idlichchieuphim=${id}`;
    var isReservated=await db.load(isReservatedQuery);
    return isReservated.length>0?true:false;
}
