var express = require('express');

var ingressoRouter = express.Router();

var configuracaoIngressoModel = require('../models/ConfiguracaoIngressoEventoModel');
var ingressoModel = require('../models/IngressoModel');
var ingressoController = require('../controller/IngressoController')(ingressoModel, configuracaoIngressoModel);


ingressoRouter.route('/')
		.post(function(req, res){
			ingressoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			ingressoController.listar(req, res);
		});


ingressoRouter.use('/:ingressoId', function(req, res, next){
	console.log('chegou no middleware');
	console.log(req.params);
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
		.patch(function(req, res){
			ingressoController.atualizar(req, res);  
		})
		.delete(function(req, res){
			ingressoController.remover(req, res);
		});

		
ingressoRouter.route('/baixa/:ingressoId')
		.post(function(req, res){
			console.log('chegou post baixa');
			console.log(req.params);
			console.log(req.params.ingressoId);
			ingressoModel.findById(req.params.ingressoId, function(err, ingresso){
				if(err){
					res.status(500).send(err);
				} else {
					console.log('vai chamar o baixa');
					ingressoController.confirmarEntrada(ingresso,req, res);
				}
			});

			
		});

module.exports = ingressoRouter;
