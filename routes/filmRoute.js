var express = require('express');
var jsonUtils = require('../app-helpers/json_utils');
var filmRoute = express.Router();
var film = require('../models/film');


filmRoute.get("/futureFilm", async function (req, res) {
    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;

    film.loadFilm(rec_per_page, offset, 1).then(function (data) {
        var number_of_pages = data.total / rec_per_page;
        if (data.total % rec_per_page > 0) {
            number_of_pages++;
        }

        var pages = [];
        for (var i = 1; i <= number_of_pages; i++) {
            pages.push({
                pageValue: i,
                isActive: i === +curPage
            });
        }
        res.render('film/futureFilm', {
            layoutModels: res.locals.layoutModels,
            isEmpty: data.rows.length === 0,
            total: data.total,
            rows: data.rows,
            pages: pages,
            curPage: curPage,
            prevPage: curPage - 1,
            nextPage: parseInt(curPage) + 1,
            showPrevPage: curPage > 1,
            showNextPage: curPage < number_of_pages - 1
        });
    });
})

filmRoute.get("/presentFilm", async function (req, res) {
    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;

    film.loadFilm(rec_per_page, offset, 0).then(function (data) {
        var number_of_pages = data.total / rec_per_page;
        if (data.total % rec_per_page > 0) {
            number_of_pages++;
        }

        var pages = [];
        for (var i = 1; i <= number_of_pages; i++) {
            pages.push({
                pageValue: i,
                isActive: i === +curPage
            });
        }

        res.render('film/presentFilm', {
            layoutModels: res.locals.layoutModels,
            isEmpty: data.rows.length === 0,
            total: data.total,
            rows: data.rows,
            pages: pages,
            curPage: curPage,
            prevPage: curPage - 1,
            nextPage: parseInt(curPage) + 1,
            showPrevPage: curPage > 1,
            showNextPage: curPage < number_of_pages - 1
        });
    });
})
filmRoute.get('/', async function (req, res) {
    var films = await film.getFilm();

    var presentFilm = films.filter(function (x) {
        return x.tinhtrang == 0;
    });
    var futureFilm = films.filter(function (x) {
        return x.tinhtrang == 1;
    });

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
    // films=films.map(function(x)
    // {
    //     let temp=new Date(x.KhoiChieu);
    //     x.KhoiChieu=temp.getDate()+'/'+(parseInt(temp.getMonth())+1)+'/'+temp.getFullYear();
    //     return x;
    // })
    //console.log(futureFilm);
    res.render('film/index', { totalPagePresent: totalPagePresent, totalPageFuture: totalPageFuture, presentFilm: encodeURIComponent(JSON.stringify(presentFilm)), futureFilm: encodeURIComponent(JSON.stringify(futureFilm)) });


})
filmRoute.get("/detail/:id", async function (req, res) {
    var detailFilm = await film.getFilmById(req.params.id);

    res.render("film/detail", { detailFilm: detailFilm[0] });
})
module.exports = filmRoute;