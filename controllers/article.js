'use strict'

//modulos terceros
var validator = require('validator');
var fs = require('fs');
var path = require('path');

//modulos propios
var Article = require('../models/article');

var controller = {
    datosCurso:(req, res) => {
        return res.status(200).send({
            curso: 'Master en Frameworks Js',
            autor: 'Victor Robles WEB',
            url: 'victorroblesweb.es'
        });
    }, // datosCurso

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    }, // end test

    save: (req, res) => {
        // Recoger parametros por post
        var params = req.body;
        // Validar datos (validador)
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

        if(validate_title && validate_content){
            // Crear el objeto a guardar
            var article = new Article();

            // Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            // Guardar el articulos
            article.save((err,  articleStored) =>{

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Datos no Validos'
            });
        }
    }, // end save

    getArticles:(req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        //  Find
        query.sort('-_id').exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los articulos !!!'
                });
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    }, // getArticles

    getArticle:(req, res) => {

        // Recoger el id de la url
        var articleId = req.params.id;

        // Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No hay articulos para mostrar !!!'
            });
        }

        // Buscar el articulo
        Article.findById(articleId, (err, article) =>{
            if(err || !article){
                return res.status(404).send({
                    status: 'error',
                    message: 'No exsiste el articulo !!!'
                });
            }

            // Devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    }, // getArticle

    update:(req, res) => {
        // Recoger el id del articulo por la url
        var articleId = req.params.id;

        // Recoger los datos que llegan por put
        var params = req.body;

        // Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'No exsiste el articulo !!!'
            });
        }

        if(validate_title && validate_content){
            // Find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true},
                (err,articleUpdated) =>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al actualizar !!!'
                        });
                    }

                    if(!articleUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el articulo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                })
        }else{
            // Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta !!!'
            });
        }
    }, // end update

    delete:(req, res) => {
        // Recogerel id de la url
        var articleId = req.params.id;

        // Find and delete
        Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) =>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar !!!'
                });
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista !!!'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },// end delete

    upload:(req, res) => {
        // Configular el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la peticion
        var fileName = 'Imagen no subida..';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            })
        }

        // conseguir nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/');

        var file_name = file_split[2];

        var extension_split = file_name.split('.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imageners, si es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            // borrar el archivo subido
            fs.unlink(file_path,(err) =>{
                return res.status(200).send({
                    status:'error',
                    message: 'la extension de la imagen no es valida'
                });
            })
        }else {
            // si todo es valido
            var articleId = req.params.id;

            // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true},
            (err, articleUpdated)=>{
                if(err || !articleUpdated){
                    return res.status(200).send({
                        status:'error',
                        message: 'Error al guardar la imagen de articulo !!'
                    });
                }

                return res.status(200).send({
                    status:'success',
                    article: articleUpdated
                });
            });
        }
    },// end upload file

    getImage:(req, res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) =>{

            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status:'error',
                    message: 'la imagen no existe !!'
                });
            }
        });
    }, // end getImage

    search: (req, res) =>{
        // Sacar el string a Buscar
        var searchString = req.params.search;

        // find
        Article.find({"$or": [
            {"title": {"$regex": searchString, "$options":"i"}},
            {"content": {"$regex": searchString, "$options":"i"}},
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            if(err){
                return res.status(500).send({
                    status:'error',
                    message: 'Error en la peticion !!'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status:'error',
                    message: 'No hay articulos que coincidan con tu busqueda!!'
                });
            }

            return res.status(200).send({
                status:'success',
                articles
            });
        })

    },// end search
};  //  end controller

module.exports = controller;
