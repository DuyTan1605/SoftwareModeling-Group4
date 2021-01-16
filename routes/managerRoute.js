var express = require('express');
var account = require('../models/account.js');
var crypto = require('crypto');
var moment = require('moment');
var nodemailer = require('nodemailer');
var film = require('../models/film');
var helperModel = require("../models/helper");
var eventModel = require("../models/event");
var serviceModel = require("../models/service");
var responseModel = require("../models/response");
var bookModel = require("../models/book");
var showTimeModel = require("../models/show-time");
var ticketModel = require("../models/ticket");
const dotenv = require("dotenv");
dotenv.config();
var cinemaRoomModel = require("../models/cinemaRoom");
var reportModel = require("../models/report");



const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_cloud_key,
    api_secret: process.env.api_secret
})

var multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/Imgs/movies'),
            cb(null, './public/Imgs/events')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.originalname)
    }
})


module.exports = managerRoute;
