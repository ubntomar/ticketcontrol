'use strict'
var express = require('express');
var ArticleController = require('../controllers/article');
var multipart= require('connect-multiparty');
var middleWareUpload= multipart({uploadDir: './upload/articles'});
var router = express.Router();
router.post('/save', ArticleController.save); 
router.get('/getArticles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);  
router.put('/update/:id', ArticleController.update);  
router.get('/prueba', ArticleController.prueba); 
router.delete('/delete/:id', ArticleController.delete); 
router.post('/upload/:id', middleWareUpload, ArticleController.uploadFile);
router.get('/getImage/:image', ArticleController.getImage); 
router.get('/search/:search', ArticleController.search); 
module.exports=router; 
