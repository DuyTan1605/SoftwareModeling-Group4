var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');
var moment = require('moment');
exports.getListTickets= async function()
{
   var listTicketsQuery=`select * from ve`;
    var listTickets=await db.load(listTicketsQuery);
    return listTickets;
}
exports.getTicketById=async function(id)
{
    var detailTicketQuery=`select * from ve where idve=${id}`;
    var detailTicket=await db.load(detailTicketQuery);
    return detailTicket[0];
}
exports.updateInfoTicket=async function(id,entity)
{

    var deferred = Q.defer();
    var sql =`update ve
    set tenve = "${entity.tenve}",giave=${entity.giave}
    where idve =${id} `
    
    var res=await db.load(sql);

    return res;
}
exports.updateStatusTicket=async function(id,entity)
{
    var deferred = Q.defer();
    var sql = mustache.render(`update ve
    set tinhtrang = {{tinhtrang}}
    where idve = `
     + id, entity);
    var res=await db.load(sql);

    return res;
}
exports.addNewTicket=async function(entity)
{
    var newTicketQuery=`insert into ve (tenve,giave,tinhtrang) values("${entity.tenve}",${entity.gia},1)`;
    var newTicket=db.load(newTicketQuery);
    return newTicket;
}
