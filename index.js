`use strict`

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

// mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog')
.then(() => {
    console.log('Conexion a la base de datos correcta !!!');

    //  Crear servidor y ponerme a escuchar peticiones http
    app.listen(port, () =>{
        console.log('Servidor corriendo en http://localhost:'+port);
    })
})
