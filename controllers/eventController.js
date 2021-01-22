var eventModel=require('../models/event');

const eventList = async function(req, res){

    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;

    eventModel.getEvent(rec_per_page, offset).then(function(data) {
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
       
        res.render('event/index', {
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
}

module.exports = {eventList}