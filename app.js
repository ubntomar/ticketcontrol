'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//moddlewars  ---los trae el body parser
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());


var article_routes = require('./routes/article'); 
//cors//


app.use('/api',article_routes);

module.exports = app; 