var express = require('express');

var ingressoModel = require('../models/IngressoModel');

var ingressoRouter = express.Router();

var ingressoController = require('../controller/IngressoController')(ingressoModel);


ingressoRouter.route('/')
		.post(function(req, res){
			ingressoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			ingressoController.listar(req, res);
		});


ingressoRouter.use('/:ingressoId', function(req, res, next){
	console.log('chegou no middleware');
	if(req.params.ingressoId == 'baixa'){
		next();
	}
	// esse é nosso middleware
	ingressoModel.findById(req.params.ingressoId, function(err, ingresso){
		if(err){
			res.status(500).send(err);
		} else if(ingresso) {
			req.ingresso = ingresso;
			next();
		} else {
			res.status(404).send('Ingresso não encontrado');
		}
	});
});


ingressoRouter.route('/:ingressoId')
		.get(function(req, res){
			res.json(req.ingresso);
		})
		.delete(function(req, res){
			ingressoController.remover(req, res);
		});

		
ingressoRouter.route('/baixa/:ingressoId')
		.patch(function(req, res){
			console.log('chegou patch');
			console.log(req.params);
			ingressoModel.findById(req.params.ingressoId, function(err, ingresso){
				if(err){
					res.status(500).send(err);
				} else {
					ingressoController.confirmarEntrada(ingresso,req, res);
				}
			});

			
		});

module.exports = ingressoRouter;
