var mustache = require("mustache");
var db = require("../app-helpers/dbHelper");
exports.getFilmRevenue = async function (year,month) {
  var allFilmRevenueQuery = mustache.render(`select P.tenphim,P.idphim,LSDV.ngaydatve,SUM(tongtien) as tongtien,SUM(soluong) as soluong
    from lichsudatve as LSDV, phim as P, lichsu_ve as LSV, lichchieuphim as LCP
    where LSDV.tinhtrang=1 and LCP.idlichchieuphim=LSDV.idlichchieuphim and LSDV.idlichsudatve=LSV.idlichsu 
    and LCP.idphim=P.idphim
    group by P.idphim,LSDV.ngaydatve`);
  var allFilmRevenue = await db.load(allFilmRevenueQuery);
  var filmRevenue=[];
  for(let i=0;i<allFilmRevenue.length;i++)
  {
    var a = new Date(allFilmRevenue[i].ngaydatve).getUTCFullYear();
    if(year==a)
    {
      var b = new Date(allFilmRevenue[i].ngaydatve).getMonth()+1;
      if(month==b)
      {
        filmRevenue.push(allFilmRevenue[i]);
      }
    }
  }
  return filmRevenue;
};
exports.getTotalRevenue = async function (year,month) {
  var allFilmRevenueQuery = mustache.render(`select P.tenphim,P.idphim,LSDV.ngaydatve,SUM(tongtien) as tongtien,SUM(soluong) as soluong
    from lichsudatve as LSDV, phim as P, lichsu_ve as LSV, lichchieuphim as LCP
    where LSDV.tinhtrang=1 and LCP.idlichchieuphim=LSDV.idlichchieuphim and LSDV.idlichsudatve=LSV.idlichsu 
    and LCP.idphim=P.idphim
    group by P.idphim,LSDV.ngaydatve`);
  var allFilmRevenue = await db.load(allFilmRevenueQuery);
  let totalRevenue = 0;
  for(let i=0;i<allFilmRevenue.length;i++)
  {
    var a = new Date(allFilmRevenue[i].ngaydatve).getUTCFullYear();
    if(year==a)
    {
      var b = new Date(allFilmRevenue[i].ngaydatve).getMonth()+1;
      if(month==b)
      {
        totalRevenue= totalRevenue + allFilmRevenue[i].tongtien;
      }
    }
  }
  return totalRevenue;
};