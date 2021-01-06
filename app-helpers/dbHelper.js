var Q = require('q');
var mysql = require('mysql');

var HOST = process.env.hostname_heroku || 'localhost',
    DB = process.env.database_heroku || 'rapphim',
    USER = process.env.username_heroku || 'root',
    PWD = process.env.password_heroku || '123';

function connect() {

    var deferred = Q.defer();

    var cn = mysql.createConnection({
        host: HOST,
        port:'3306',
        user: USER,
        password: PWD,
        database: DB,
        connectionLimit: 2000
    });


    cn.connect(function(err) {
        if (err) throw err;
        deferred.resolve(cn);
    });

    cn.on('error', function(err) {
        console.log(err.code);
      });
   
    return deferred.promise;
}

exports.load = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, rows, fields) {
            if (err) throw err;
            deferred.resolve(rows);
        });

        cn.end(function(err) {
            if (err) {
            return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });

    });

    return deferred.promise;
}

exports.insert = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, res) {
            if (err) throw err;
            deferred.resolve(res.insertId);
        });
        cn.end(function(err) {
            if (err) {
            return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
       
    });

    return deferred.promise;
}

exports.update = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, res) {
            if (err) throw err;
            deferred.resolve(res.changedRows);
        });
        cn.end(function(err) {
            if (err) {
            return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
       
    });

    return deferred.promise;
}

exports.delete = function(sql) {

    var deferred = Q.defer();

    connect().then(function(cn) {
        cn.query(sql, function(err, res) {
            if (err) throw err;
            deferred.resolve(res.affectedRows);
        });
        cn.end(function(err) {
            if (err) {
            return console.log('error:' + err.message);
            }
            console.log('Close the database connection.');
        });
     
    });

    return deferred.promise;
}
