var path = require('path');
// var http = require('http');
const dotenv=require("dotenv");
dotenv.config();
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(stripeSecretKey)
var express = require('express');
var session = require('express-session');

var passport=require('passport');
var GoogleStrategy=require('passport-google-oauth2').Strategy;
var cookieSession=require('cookie-session');
var cors=require('cors');
require('./passport.js');
// var keys=require('./key');
// var fileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);

var exphbs = require('express-handlebars');
var exphbs_sections = require('express-handlebars-sections');

var helpers_express = require('handlebars-helpers')({exphbs:exphbs});


var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var morgan = require('morgan');
//var mustache = require('mustache');
var moment = require('moment');
var wnumb = require('wnumb');
var layoutRoute = require('./routes/_layoutRoute');
var homeRoute = require('./routes/homeRoute');
var accountRoute = require('./routes/accountRoute');
var managerRoute = require('./routes/managerRoute');
var searchRoute = require('./routes/searchRoute');
var filmRoute = require('./routes/filmRoute');
var theaterRoute = require('./routes/theaterRoute');
var showTimeRoute = require('./routes/showTimeRoute');
var eventRoute=require('./routes/eventRoute');
var memberRoute=require('./routes/memberRoute');
var bookRoute=require('./routes/bookRoute');
var bookTicketRoute=require('./routes/bookTicket');
var restrict = require('./middle-wares/restrict');
var checkPermission=require("./middle-wares/checkPermission");
var app = express();

app.use(cors())
//
// logger

app.use(morgan('tiny'));

//
// view engine

app.engine('hbs', exphbs({
    extname: 'hbs',
    // defaultLayout: 'main',
    // layoutsDir: 'views/layouts/',
    // partialsDir: 'views/partials/',
    helpers: {
        section: exphbs_sections(),
        formatShortDate:function(date)
        {
            var date=new Date(date);
            return date.getDate()+" / "+((date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1));
        }   
        ,
        formatDate:function(date)
        {
            var date=new Date(date);
            return date.getFullYear()+"-"+((date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1))+"-"+date.getDate();
        }   
        ,
        compare:function(val1,val2)
        {
            console.log(val1,val2);
            return val1==val2;
        },
        getFilmName:function(x)
        {
            return JSON.parse(x)[0].TenPhim;
        },
        getList:function(list)
        {
            var res=JSON.parse(decodeURIComponent(list));
           return res;
        },
        getName:function(name)
        {
            if(name!=null)
            return name.split(" ")[name.split(" ").length-1];
            return " ";
        },
        now: function() {
            return String(moment().format('YYYY-MM-DD - HH:mm')).replace(/&#x2F;/g,"-").substring(0,10); 
        },
        formatNumber: function(n) {
            var nf = wnumb({
                thousand: ','
            });
            return nf.to(n);
        },
        timeRemain: function(date) {
            date=new Date(date);
           
            var timeDiff = -moment()+date.getTime();
            
            var string = "";
            if (timeDiff > 86400000) {
                string += Math.floor(timeDiff / 86400000);
                string += " ngày ";
                timeDiff = timeDiff % 86400000;
            }
            if (timeDiff > 3600000) {
                string += Math.floor(timeDiff / 3600000);
                string += " giờ ";
                timeDiff = timeDiff % 3600000;
            }
            if (timeDiff > 60000) {
                string += Math.floor(timeDiff / 60000);
                string += " phút";
            }
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
           // return string.substring(0, 14);
           return string;
        },
        sub: function(i1, i2) {
            var i = +i1 - +i2;
            return i;
        },
        add: function(i1, i2) {
            var i = +i1 + +i2;
            return i;
        },
        shortDateTime: function(datetime) {
            var full = datetime.toString();
            var dt = full.substring(0, 10);
            return dt;
        },
        isEqual: function(val1, val2, options) {
            console.log(val1,val2);
            if (val1 == val2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        isManage: function(val,options) {
            if (val==1 || val==undefined) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        hideRealUserName: function(name) {
            if (name != null) {
                var nameStr = name.toString();
                var hidden = "***" + nameStr.substring(nameStr.length - 3, nameStr.length);
                return hidden;
            }
        },
        decode:function decode(val) {
            var uri_enc = encodeURIComponent(val);
            var uri_dec = decodeURIComponent(val);
           return uri_dec;
        }
    }
}));
app.set('view engine', 'hbs');

//
// static files & favicon

app.use(express.static(
    path.resolve(__dirname, 'public')
));

app.use(favicon(
    path.join(__dirname, 'public', 'logo_favicon.ico')
));

//
// body-parser

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

//
// session


// app.use(cookieSession({
//     name: 'tuto-session',
//     keys: ['key1', 'key2']
//   }))

app.use(session({
    secret: process.env.session_key,
    resave: false,
    saveUninitialized: true,  
    cookie:{},  
    // store: new fileStore()
    store: new MySQLStore({
        host: process.env.hostname_heroku || '127.0.0.1',
        port: 3306,
        user: process.env.username_heroku || 'root',
        password: process.env.password_heroku || '123',
        database: process.env.database_heroku || 'rapphim',
        connectionLimit: 20,
        createDatabaseTable: true,
        // schema: {
        //     tableName: 'sessions',
        //     columnNames: {
        //         session_id: 'session_id',
        //         expires: 'expires',
        //         data: 'data'
        //     }
        // }
    }),
}));

//


app.use(passport.initialize());
app.use(passport.session());

// routes

app.use(layoutRoute);
app.use('/home',homeRoute);
app.use('/search', searchRoute);
app.use('/account',accountRoute);
app.use('/manager', restrict,checkPermission,managerRoute);
app.use('/film', filmRoute);
app.use('/theater', theaterRoute);
app.use('/showTimes',showTimeRoute );
app.use('/event',eventRoute);
app.use('/member',memberRoute);
app.use('/book',restrict,bookRoute);
app.use('/bookticket',restrict,bookTicketRoute);
app.get('/', function(req, res) {
    res.redirect('/home');
});

app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
     
    })
    
  );

app.get("/auth/facebook",passport.authenticate('facebook',{scope:'email'}))

app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect : '/login'}),
function(req,res){
    req.session.isLogged=true;
    req.session.account=
    {
    id: req.user.id,
    name: req.user.ten,
    email: req.user.email,
    dob: req.user.ngaysinh,
    permission: req.user.quyenhan,
    gender: req.user.gioitinh,
    positivepoint: req.user.diemcong,
    address:req.user.diachi,
    type:req.user.loaitk
    }
   
    res.redirect("/home");
});

app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {
        req.session.isLogged=true;
        req.session.account=
        {
        id: req.user.id,
        name: req.user.ten,
        email: req.user.email,
        dob: req.user.ngaysinh,
        permission: req.user.quyenhan,
        gender: req.user.gioitinh,
        positivepoint: req.user.diemcong,
        address:req.user.diachi,
        type:req.user.loaitk
        }
       
        res.redirect("/home");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
