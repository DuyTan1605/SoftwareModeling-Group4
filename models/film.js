var Q = require('q');
var mustache = require('mustache');
var db = require('../app-helpers/dbHelper');

function checkExists(name,list)
{
    for(let i=0;i<list.length;i++)
    {
        if(list[i].tenphim==name)
        {
            return i;
        }
    }
    return -1;
}
exports.getPresentFilm=async function(nowDate)
{
    var filmListQuery=`select P.*,TL.tentheloai from phim_theloai as PTL,phim as P,TheLoai as TL, lichchieuphim as LCP
    where PTL.idphim=P.idphim and TL.idtheloai=PTL.idtheloai and LCP.idphim=P.idphim and LCP.ngaychieu>="${nowDate}"`;
    console.log(filmListQuery);
    var filmList=await db.load(filmListQuery);
    var newFilmList=[];
    for(let i=0;i<filmList.length;i++)
    {   
        let pos=checkExists(filmList[i].tenphim,newFilmList);
        if(pos==-1)
        {
            let temp=filmList[i];
            temp.arrFilmType=[];
            temp.arrFilmType.push(filmList[i].tentheloai);
            newFilmList.push(temp);
        }
        else{
            newFilmList[pos].arrFilmType.push(filmList[i].tentheloai);
        }
    }
  
    return newFilmList;
}
exports.cls=async function()
{
    var filmListQuery=mustache.render(`select P.*,TL.tentheloai from phim_theloai as PTL,phim as P,TheLoai as TL where PTL.idphim=P.idphim and TL.idtheloai=PTL.idtheloai`);
    var filmList=await db.load(filmListQuery);
    var newFilmList=[];
    for(let i=0;i<filmList.length;i++)
    {   
        let pos=checkExists(filmList[i].tenphim,newFilmList);
        if(pos==-1)
        {
            let temp=filmList[i];
            temp.arrFilmType=[];
            temp.arrFilmType.push(filmList[i].tentheloai);
            newFilmList.push(temp);
        }
        else{
            newFilmList[pos].arrFilmType.push(filmList[i].tentheloai);
        }
    }
  
    return newFilmList;
}
exports.getFilmById=async function(id)
{
    var deferred=Q.defer();
   var detailFilmQuery=mustache.render(`select P.*,TL.tentheloai from phim as P,phim_theloai as PTL,theloai as TL where P.idphim=PTL.idphim and PTL.idtheloai=TL.idtheloai and PTL.idphim=${id}`);
    var detailFilm=await db.load(detailFilmQuery);
    var newDetailFilm=[];
    for(let i=0;i<detailFilm.length;i++)
    {    
        let pos=checkExists(detailFilm[i].tenphim,newDetailFilm);
        if(pos==-1)
        {
            let temp=detailFilm[i];
            temp.arrFilmType=[];
            temp.arrFilmType.push(detailFilm[i].tentheloai);
            newDetailFilm.push(temp);
        }
        else{
            newDetailFilm[pos].arrFilmType.push(detailFilm[i].tentheloai);
        }
    }
    return newDetailFilm;
}

exports.loadAllType=async function()
{
    var sql='select * from theloai';
    var res=await db.load(sql);
    return res;
}

exports.loadFilm=function(limit,offset,orderWord)
{

    var deferred = Q.defer();
 
    var entity = {
        limit: limit,
        offset: offset,
        orderWord:orderWord
    };
    console.log(entity);
    var promises = [];
    var sql_1;
    var sql_2;
    sql_1=mustache.render('SELECT COUNT(DISTINCT P.idphim) as total from phim as P,phim_theloai as PTL where P.idphim=PTL.idphim and P.tinhtrang={{orderWord}}', entity);
    sql_2= mustache.render('SELECT DISTINCT P.* from phim as P,phim_theloai as PTL where P.idphim=PTL.idphim and P.tinhtrang={{orderWord}} LIMIT {{limit}} OFFSET {{offset}}', entity);
    
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
exports.searchFilm = function(word, cat, orderBy, limit, offset,orderWord) {
    var deferred = Q.defer();
 
    var entity = {
        limit: limit,
        offset: offset,
        orderBy: orderBy,
        word: word, 
        cat: cat,
        orderWord:orderWord
    };
    console.log(entity);
    var promises = [];
    entity.cat=entity.cat=="danhmuc"?"":entity.cat;
    var sql_1;
   
    
    var sql_2;
     if(entity.orderWord!=-1)
     {
        sql_1=mustache.render('SELECT COUNT(DISTINCT P.idphim) as total from phim as P,phim_theloai as PTL where P.tenphim LIKE CONCAT("%","{{word}}" ,"%") and PTL.idtheloai LIKE CONCAT("%","{{cat}}" ,"%") and P.idphim=PTL.idphim and P.tinhtrang={{orderWord}} ORDER BY {{orderBy}}', entity);
     sql_2= mustache.render('SELECT DISTINCT P.* from phim as P,phim_theloai as PTL where p.tenphim LIKE CONCAT("%","{{word}}" ,"%") and PTL.idtheloai LIKE CONCAT("%","{{cat}}" ,"%") and P.idphim=PTL.idphim and P.tinhtrang={{orderWord}} ORDER BY {{orderBy}} LIMIT {{limit}} OFFSET {{offset}}', entity);
     }
     else{
        sql_1=mustache.render('SELECT COUNT(DISTINCT P.idphim) as total from phim as P,phim_theloai as PTL where P.tenphim LIKE CONCAT("%","{{word}}" ,"%") and PTL.idtheloai LIKE CONCAT("%","{{cat}}" ,"%") and P.idphim=PTL.idphim ORDER BY {{orderBy}}', entity);
        sql_2= mustache.render('SELECT DISTINCT P.* from phim as P,phim_theloai as PTL where p.tenphim LIKE CONCAT("%","{{word}}" ,"%") and PTL.idtheloai LIKE CONCAT("%","{{cat}}" ,"%") and P.idphim=PTL.idphim ORDER BY {{orderBy}} LIMIT {{limit}} OFFSET {{offset}}', entity);
     }
    // else
    // {
    //     sql_1=mustache.render('SELECT COUNT(DISTINCT P.idphim) as total from phim as P,phim_theloai as PTL where P.tenphim LIKE CONCAT("%","{{word}}" ,"%") and PTL.idtheloai LIKE CONCAT("%","{{cat}}" ,"%") and P.idphim=PTL.idphim ORDER BY {{orderBy}}', entity);
    //     sql_2 = mustache.render('SELECT DISTINCT P.* from phim as P,phim_theloai as PTL where p.tenphim LIKE CONCAT("%","{{word}}" ,"%") and PTL.idtheloai LIKE CONCAT("%","{{cat}}" ,"%") and P.idphim=PTL.idphim ORDER BY {{orderBy}} LIMIT {{limit}} OFFSET {{offset}}', entity);
    // }
    //console.log(sql_2);
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

exports.updateInfoFilm=async function(id,entity)
{

    var deferred = Q.defer();
   // console.log(entity);
    var sql = `update phim 
    set tenphim = "${entity.tenphim}",ngayphathanh="${entity.ngayphathanh}",daodien="${entity.daodien}",
    dienvien="${entity.dienvien}",tomtat="${entity.tomtat}",thoiluong=${entity.thoiluong},diemdanhgia=${entity.diemdanhgia},
    hinhanh="${entity.hinhanh}",tinhtrang=${entity.tinhtrang},khoichieu="${entity.khoichieu}",linktrailer="${entity.linktrailer}"
    where idphim =${id} `;
    var res=await db.load(sql);

    return res;
}
exports.addNewFilm=async function(entity)
{
    var addNewFilmQuery=`insert into phim (tenphim,ngayphathanh,daodien,dienvien,tomtat,thoiluong,diemdanhgia,hinhanh,tinhtrang,khoichieu,linktrailer)
    values ("${entity.tenphim}","${entity.ngayphathanh}",
    "${entity.daodien}","${entity.dienvien}","${entity.tomtat}",${entity.thoiluong},${entity.diemdanhgia},"${entity.hinhanh}",${entity.tinhtrang}
    ,"${entity.khoichieu}","${entity.linktrailer}")`;
    var addNewFilm=await db.load(addNewFilmQuery);
    return addNewFilm;
}
exports.addFilmType=async function(idphim,idtheloai)
{
    var addFilmTypeQuery=`insert into phim_theloai (idphim,idtheloai) values (${idphim},${idtheloai})`;
    console.log(addFilmTypeQuery);
    var addFilmType=await db.load(addFilmTypeQuery);
    return addFilmType;
}
exports.deleteFilmType=async function(idphim)
{
    var deleteFilmTypeQuery=`delete from phim_theloai where idphim=${idphim}`;
   
    var deleteFilmType=await db.load(deleteFilmTypeQuery);
    return deleteFilmType;
}
exports.isPresent= async function(id)
{
    var checkFilmPresentQuery=`select * from lichchieuphim where idphim=${id}`;
    var checkFilmPresent=await db.load(checkFilmPresentQuery);
    return checkFilmPresent.length>0;
}
exports.deleteFilmById=async function(id)
{
    var delFilm_TypeFilmQuery=`delete from phim_theloai where idphim=${id}`;
    var delFilm_TypeFilm=await db.load(delFilm_TypeFilmQuery);
    var delFilmQuery=`delete from phim where idphim=${id}`;
    var checkFilmPresent=await db.load(delFilmQuery);
    return checkFilmPresent;
}
exports.getFilm=async function()
{
    var sql=`select * from phim`;
    var listFilm=await db.load(sql);
    return listFilm;
}



