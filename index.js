'use strict'

var mongoose = require('mongoose');
var app=require('./app');
var port =3000; /////
mongoose.Promise=global.Promise;
mongoose.set('useFindAndModify',false);
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser: true,useUnifiedTopology: true})
.then( ()=>{
    console.log('la conexion a  la base de dato ha realizado bien!');
    app.listen(port, () => {
        console.log('servidor http funcionando correctamente'); 
    } );   

});
