'use strict'
var validator = require('validator');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');
var controller = {
    save: (req, res) => {
        var params = req.body;
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }
        catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar o parámetros inválidos!'
            });
        }
        if (validate_title && validate_content) {
            var article = new Article();
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            article.save((err, articleStored) => {
                if (err || !articleStored)
                    return res.status(404).send({
                        status: 'error',
                        message: 'Los datos no se han podido guardar!'
                    }); else
                    return res.status(200).send({
                        status: 'success',
                        message: 'Los datos se han almacenado en la base de datos correctamente!'
                    });
            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }
    },
    getArticles: (req, res) => {
        var query = Article.find({});
        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(2);
        }
        query.sort('_id').exec((err, articles) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Los datos para  encontrar artículos tienen problemas o no son válidos'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encuentran artículos con ese criterio'
                });
            }
            return res.status(200).send({
                status: 'success',
                message: 'Estamos obteniendo articulos de la base de datos MongoDB!',
                articles
            });
        });
    },
    getArticle: (req, res) => {
        var articleId = req.params.id;
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No se ha recibido ningún Id de artículo!'
            });
        }
        Article.findById(articleId, (err, article) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al ejecutar la búsqueda del artículo!'
                });
            }
            if (!article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ecuentra artículo con ese id!'
                });
            }
            return res.status(200).send({
                status: 'success',
                message: 'Obtuvimos Artículo de la base de datos MongoDB!',
                article
            });
        });
    },
    update: (req, res) => {
        var articleId = req.params.id;
        var params = req.body;
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar',
            });
        }
        if (validateTitle && validateTitle) {
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar',
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al actualizar articleUpdated return false (No existe el artículo)',
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    message: 'Artículo almacenado con éxito!',
                    article: articleUpdated
                })

            });
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'Validación de título y contenido no es correcta.',
            });
        }
    },
    prueba: (req, res) => {
        return res.status(200).send({
            status: 'success',
            message: 'Estamos obteniendo articulos de la base de datos MongoDB!',
        });
    },
    delete: (req, res) => {
        var articleId = req.params.id;
        try {
            Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en el Id del arículo a borrar, Id no encontrado!'
                    })
                }
                if (!articleRemoved) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'El artículo no pudo ser removido!'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    message: 'El artículo se ha removido con éxito',
                    article: articleRemoved
                });
            })
        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error en el bloque de código al intentar borrar el artículo de la base de datos'
            })

        }
    },
    uploadFile: (req, res) => {
        var fileName = 'imagen no subida...';
        if (!req.files) {
            return res.status(400).send({
                status: 'error',
                message: 'La imágen no ha sido subida'
            })
        }
        var filePath = req.files.file0.path;//file0= field name on input form.
        var fileSplit = filePath.split('/');
        var fileName = fileSplit[2];
        var extensionFile = fileName.split('.');
        var extensionFileName = extensionFile[1];
        if (extensionFileName.toUpperCase() != 'JPG' && extensionFileName.toUpperCase() != 'JPG' && extensionFileName.toUpperCase() != 'GIF' && extensionFileName.toUpperCase() != 'PNG') {
            fs.unlink(filePath, (err) => {
                return res.status(400).send({
                    status: 'error',
                    message: 'El archivo tiene una extension inválida :' + extensionFileName
                })
            })
        }
        else {
            var articleId = req.params.id;
            Article.findOneAndUpdate({ _id: articleId }, { image: fileName }, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'success',
                        message: 'Error al intentar actualizar la imágen en la base de datos'
                    })
                }
                if (!articleUpdated) {
                    return res.status(400).send({
                        status: 'success',
                        message: 'No existe el artículo en la base de datos'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    articulo: articleUpdated
                })
            });
        }
    },
    getImage: (req, res) => {
        var file = req.params.image;
        var filePath = './upload/articles/' + file;
        console.log(filePath);
        fs.exists(filePath, (exists) => {
            console.log(exists);
            if (exists) {
                return res.sendFile(path.resolve(filePath));
            } else {
                return res.status(404).send({
                    status: 'Error',
                    message: 'No encuentro el fichero en el servidor'
                })
            }
        })
    },
    search: (req, res) => {
        var searchString = req.params.search;
        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err || !articles) {
                    return res.status(500).send({
                        status: "error",
                        message: "No se encuentran artículos"
                    });
                }
                return res.status(200).send({
                    status: "success",
                    message: "Artículos encontrados:",
                    articles
                });
            });
    }
}
module.exports = controller;  