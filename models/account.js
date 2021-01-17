var Q = require('q');
var mustache = require('mustache');
var moment = require('moment');

var db = require('../app-helpers/dbHelper');

module.exports.addUserSocial=async function(entity)
{
    let sql=mustache.render(`insert into taikhoan (email, ten,matkhau, ngaysinh, quyenhan, gioitinh,diemcong,diachi,sodienthoai,loaitk) 
    values ("{{email}}","{{ten}}","{{matkhau}}","{{ngaysinh}}",{{quyenhan}},"{{gioitinh}}",{{diemcong}},"{{diachi}}","{{sodienthoai}}",{{loaitk}})
    `,entity);
    let res=db.load(sql);
    return res;

}
module.exports.updateUserSocial=async function(entity)
{
    let sql=`update taikhoan set loaitk=`+entity.loaitk+` where email="`+entity.email+`"`;
   console.log(sql);
    let res=await db.load(sql);
    return res;
}
module.exports.findUserSocial=async function(email,type)
{
    let sql=`select * from taikhoan where email= "`+email+`" and loaitk=`+type;
    const res=await db.load(sql);
    return res.length>0?res[0]:null;
}
module.exports.loadAccountbyId = function(id) {
    var deferred = Q.defer();
    var sql = 'select * from taikhoan where id = ' + id;
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

module.exports.loadAccountbyEmail =async function(email) {
   let sql='SELECT * FROM taikhoan WHERE email="'+email+'"';
  
  
   const rs=await db.load(sql);
   console.log(rs[0]);
   if(rs.length>0)
   {

    return rs[0];
    }
    return null;
}

exports.insert = function(entity) {

    var deferred = Q.defer();

    var sql =
        mustache.render(
            'insert into taikhoan (matkhau, ten, email, ngaysinh, quyenhan, gioitinh,diachi) values ( "{{password}}", "{{name}}", "{{email}}", "{{dob}}", {{permission}}, {{gender}},"{{address}}")',
            entity
        );

    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.updateInfo = function(entity) {
    var deferred = Q.defer();
    
    var sql = `UPDATE taikhoan SET ten = "${entity.name}", ngaysinh="${entity.dob}", gioitinh=${entity.gender},diachi="${entity.address}" WHERE id=${entity.id}`;
    db.update(sql).then(function(result) {
        if (result > 0) {
            var sql_2 = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', entity);
            db.load(sql_2).then(function(rows) {
                var account = {
                    id: rows[0].id,
                    //username: rows[0].f_Username,
                    name: rows[0].ten,
                    email: rows[0].email,
                    dob: rows[0].ngaysinh,
                    permission: rows[0].quyenhan,
                    gender: rows[0].gioitinh,
                    positivepoint: rows[0].diemcong,
                    address:rows[0].diachi
                }
                deferred.resolve(account);
            });
        } else {
            deferred.resolve(null);
        }
    });
    return deferred.promise;
}

exports.updatePassword = function(pw) {
    var deferred = Q.defer();
    var sql = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', pw);
    db.load(sql).then(function(rows) {
       var temp=rows[0].matkhau.replace(/&#x2F;/g,"/");
       console.log(temp);
        if (pw.oldPW == temp || pw.oldPW == rows[0].matkhau) {
            var sql2 = `UPDATE taikhoan SET matkhau="${pw.newPW}" WHERE id=${pw.id}`;
            db.update(sql2).then(function(result) {
                if (result > 0) {
                    deferred.resolve(1);
                } else {
                    deferred.resolve(0);
                }
            });
        } else {
            deferred.resolve(0);
        }
    });
    
    return deferred.promise;

}

exports.login = function(entity) {

    var deferred = Q.defer();
   // console.log(entity);
    var sql =`select * from taikhoan where email = "${entity.email}" and matkhau = "${entity.password}"`;
        console.log(sql);
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            console.log(rows[0].diemcong);
            var account = {
                id: rows[0].id,
                name: rows[0].ten,
                email: rows[0].email,
                dob: rows[0].ngaysinh,
                permission: rows[0].quyenhan,
                gender: rows[0].gioitinh,
                positivepoint: rows[0].diemcong,
                address:rows[0].diachi
            }
            deferred.resolve(account);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadAll = function() {

    var deferred = Q.defer();

    var sql = 'select * from taikhoan where quyenhan = 1';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.delete = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render(
        'delete from taikhoan where id = {{id}}',
        entity
    );

    db.delete(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.reset = function(entity) {
    var deferred = Q.defer();

    var sql = `update taikhoan set matkhau="${entity.pass}" where id=${entity.id}`;

    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.loadApproval = function() {

    var deferred = Q.defer();

    var sql = 'select tk.email, tk.ten, xb.id, xb.thoigianxin, xb.nguoixin from taikhoan tk, xinduocban xb where tk.id = xb.nguoixin and xb.trangthai = 0 order by xb.thoigianxin asc ';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.getEmailById = function(id) {
    var deferred = Q.defer();

    var sql = 'select email from taikhoan where id =' + id;

    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.isEmailExisted = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('select * from taikhoan where email = "{{email}}"', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });

    return deferred.promise;
}


exports.updateDiemCong=function(entity)
{
    var deferred=Q.defer();
    var sql = mustache.render('update taikhoan set diemcong = {{diem}} where id={{id}}', entity);
    console.log(sql);
    db.update(sql).then(function(changedRows){
        deferred.resolve(changedRows);
    });
    return deferred.promise;
}
exports.loadHistoryBooking=async function(id)
{
    var listHistoryBookingQuery=`select LS.*,P.tenphim,PC.tenphongchieu,RP.tenrap,KV.tenkhuvuc,LCP.giochieu,LCP.ngaychieu 
    from lichsudatve as LS,lichchieuphim as LCP,phim as P,phongchieu as PC,rapphim as RP,khuvuc as KV
    where LS.idkhachhang=${id} and LS.idlichchieuphim=LCP.idlichchieuphim and P.idphim=LCP.idphim and LCP.idphongchieu=PC.idphongchieu
    and PC.idrap=RP.idrap and RP.idkhuvuc=KV.idkhuvuc `;
    var listHistoryBooking=await db.load(listHistoryBookingQuery);
    return listHistoryBooking;
}
exports.setNewPass=function(pw)
{
    var deferred = Q.defer();
    pw.newPW=pw.newPW.replace(/&#x2F;/g,"/");
    var sql = `UPDATE taikhoan SET matkhau="${pw.newPW}" WHERE email="${pw.id}"`;
    db.update(sql).then(function(rows) {
        
        if(rows>0)
        {
            
            deferred.resolve(rows);
        }
        else {
            deferred.resolve(0);
        }
    });
    
    return deferred.promise;
}
exports.insertResponse=async function(id,content,datetime)
{
    var sql=`insert into phanhoi (noidungphanhoi,manguoigoi,thoigianphanhoi) values ("${content}",${id},"${datetime}")`;
    var res=await db.load(sql);
    return res;
}
exports.loadAllResponse=async function(id)
{
    var sql=`select * from phanhoi where manguoigoi=${id}`;
    var res=await db.load(sql);
    return res;
}
exports.isDebt=async function(id)
{
    var sql=`select * from lichsudatve where idkhachhang=${id} and tinhtrang=0`;
    var res=await db.load(sql);
    return res.length>0?1:0;
}
exports.loadAllHistoryBooking=async function()
{
    var listHistoryBookingQuery=`select LS.*,P.tenphim,PC.tenphongchieu,RP.tenrap,KV.tenkhuvuc,LCP.ngaychieu,LCP.giochieu,TK.sodienthoai 
    from lichsudatve as LS,lichchieuphim as LCP,phim as P,phongchieu as PC,rapphim as RP,khuvuc as KV,taikhoan as TK 
    where LS.idlichchieuphim=LCP.idlichchieuphim and P.idphim=LCP.idphim and LCP.idphongchieu=PC.idphongchieu
    and PC.idrap=RP.idrap and RP.idkhuvuc=KV.idkhuvuc and TK.id=LS.idkhachhang`;
    var listHistoryBooking=await db.load(listHistoryBookingQuery);
    return listHistoryBooking;
}

