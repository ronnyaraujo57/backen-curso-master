`use strict`

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;
var url_mongodb_atlas = 'mongodb+srv://ronnyaraujo57:Ronnymak16@cluster0.aqz7f.mongodb.net/test'
var url_local = 'mongodb://localhost:27017/api_rest_blog'

// mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect(url_mongodb_atlas)
.then(() => {
    console.log('Conexion a la base de datos correcta !!!');

    //  Crear servidor y ponerme a escuchar peticiones http
    app.listen(port, () =>{
        console.log('Servidor corriendo en http://localhost:'+port);
    })
})
