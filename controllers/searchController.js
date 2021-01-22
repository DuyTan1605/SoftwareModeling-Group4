var film=require('../models/film');

const search = function(req, res) {

    var orderBy = 'tenphim asc';
    var orderString = "Từ A đên Z"
    var orderWord="-1"
    switch (req.query.order) {
        case "1":
            orderBy = 'khoichieu asc';
            orderString = "Ngày khởi chiếu tăng dần";
            break;
        case "2":
            orderBy = 'khoichieu desc';
            orderString = "Ngày khởi chiếu giảm dần";
            break;
        case "3":
            orderBy = 'diemdanhgia asc';
            orderString = "Điểm đánh giá tăng dần";
            break;
        case "4":
            orderBy = 'diemdanhgia desc';
            orderString = "Điểm đánh giá giảm dần";
            break;
        case "5":
            orderBy= 'P.idphim asc'
            orderWord='0'
            orderString= 'Phim đang chiếu'
            break;
        case "6":
            orderBy='P.idphim asc'
            orderWord= '1'
            orderString= 'Phim sắp chiếu'
            break;
    

    }

    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;

    film.searchFilm(req.query.word, req.query.cat, orderBy, rec_per_page, offset,orderWord!=-1?orderWord:-1).then(function(data) {

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
        res.render('search/result', {
            layoutModels: res.locals.layoutModels,
            word: req.query.word,
            isEmpty: data.rows.length === 0,
            total: data.total,
            rows: data.rows,
            orderString: orderString,

            pages: pages,
            curPage: curPage,
            prevPage: curPage - 1,
            nextPage: parseInt(curPage) + 1,
            showPrevPage: curPage > 1,
            showNextPage: curPage < number_of_pages - 1
        });
    });
 }

module.exports = {search}