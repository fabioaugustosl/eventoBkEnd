var express = require('express');

var categoriaModel = require('../models/CategoriaEventoModel');

var categoriaRouter = express.Router();

var categoriaController = require('../controller/CategoriaEventoController')(categoriaModel);


categoriaRouter.route('/')
		.post(function(req, res){
			categoriaController.salvarNovo(req, res);
		})
		.get(function(req, res){
			categoriaController.listar(req, res);
		});


categoriaRouter.use('/:categoriaId', function(req, res, next){
	// esse é nosso middleware
	categoriaModel.findById(req.params.categoriaId, function(err, categoria){
		if(err){
			res.status(500).send(err);
		} else if(categoria) {
			req.categoria = categoria;
			next();
		} else {
			res.status(404).send('Categoria evento não encontrada');
		}
	});
});


categoriaRouter.route('/:categoriaId')
		.get(function(req, res){
			res.json(req.categoria);
		})
		.put(function(req, res){
			categoriaController.substituir(req, res);
		})
		.patch(function(req, res){
			categoriaController.atualizar(req, res);
		})
		.delete(function(req, res){
			categoriaController.remover(req, res);
		});
		

module.exports = categoriaRouter;
