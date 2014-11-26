/**
 * Created by usi-stefano on 11/20/14.
 */
var express = require('express');
var Mapsrouter = express.Router();
var fs = require('fs');

Mapsrouter.get('/', function(req, res){
    fs.readdir("public/data",function(err, results){
        res.json(results)

    })
});

module.exports=Mapsrouter;