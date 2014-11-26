var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();



app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var routers = require('./routes/maps');
app.use('/', routers);


module.exports = app;