var express = require('express');

var ingressoModel = require('../models/IngressoModel');

var ingressoRouter = express.Router();

var ingressoController = require('../controller/IngressoController')(ingressoModel);


ingressoRouter.use('/:ingressoId', function(req, res, next){
	console.log('chegou no middleware ingresso baixa');
	console.log(req.params);
	
	// esse é nosso middleware
	ingressoModel.findOne({ 'chave': req.params.ingressoId }, function(err, ingresso){
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
			console.log('chegou post baixa');
			console.log(req.params);
			console.log(req.params.ingressoId);
			//ingressoModel.findOne({ 'chave': req.params.ingressoId }, function(err, ingresso){
			//	if(err){
			//		res.status(500).send(err);
//} else {
					console.log('vai chamar o baixa');
					ingressoController.confirmarEntrada(req.ingresso,req, res);
			//	}
			//});

			
		});

module.exports = ingressoRouter;
