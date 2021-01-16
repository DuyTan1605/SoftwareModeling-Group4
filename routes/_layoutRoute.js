var Q = require('q');
var category = require('../models/film');


module.exports = async function (req, res, next) {

    if (req.session.isLogged == undefined) {
        req.session.isLogged = false;
    }
    var categories = await category.loadAllType();

    res.locals.layoutModels = {
        isLogged: req.session.isLogged,
        account: req.session.account,
        categories: categories
    }

    next();
};