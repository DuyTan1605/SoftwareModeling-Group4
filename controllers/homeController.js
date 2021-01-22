var Q = require("q");
var filmModel = require("../models/film");
var eventModel = require("../models/event");
const moment= require("moment");

const homePage = async function (req, res) {
    //console.log(req.session.isLogged);
    var nowDate=new Date(moment()).toISOString().substring(0,10);
  
    var films = await filmModel.getFilm();
    var presentFilm = await filmModel.getPresentFilm(nowDate);
   // console.log(presentFilm);
    var futureFilm = films.filter(function (x) {
      return x.tinhtrang == 1;
    });
    var events = await eventModel.getListEvents();
    var total_present_film = presentFilm.length;
    var total_future_film = futureFilm.length;
    const size = 6;
    var page_present_film = Math.ceil(total_present_film / size);
    var page_future_film = Math.ceil(total_future_film / size);
    var totalPagePresent = [];
    for (let i = 1; i <= page_present_film; i++) {
      totalPagePresent.push(i);
    }
    var totalPageFuture = [];
    for (let i = 1; i <= page_future_film; i++) {
      totalPageFuture.push(i);
    }
    var popular_film = presentFilm
      .sort(function (a, b) {
        return parseFloat(b.DiemDanhGia) - parseFloat(a.DiemDanhGia);
      })
      .slice(0, 3);
    //console.log(popular_film);
    res.render("home/index", {
      presentFilm: presentFilm.slice(0, 4),
      futureFilm: futureFilm.slice(0, 4),
      events: events.slice(0, 4),
      totalPagePresent: totalPagePresent,
      totalPageFuture: totalPageFuture,
      popular_film: popular_film.slice(0, 4),
    });
  }

module.exports={homePage}