var express = require('express');

var ingressoValidoModel = require('../models/IngressoValidoModel.js');

var ingressoValidoRouter = express.Router();

var ingressoValidoController = require('../controller/IngressoValidoController')(ingressoValidoModel);


ingressoValidoRouter.route('/')
		.post(function(req, res){
			ingressoValidoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			ingressoValidoController.listar(req, res);
		});


ingressoValidoRouter.use('/:dono/:idEvento/:ingressoValidoId', function(req, res, next){
	// esse é nosso middleware
	ingressoValidoModel.findOne({'dono':req.params.dono, 'idEvento':req.params.idEvento , 'codigo':req.params.ingressoValidoId}, function(err, ingValido){
		console.log('ing: ', ingValido);
		console.log(err);
		if(err){
			res.status(500).send(err);
		} else if(ingValido) {
			req.ingressoValido = ingValido;
			next();
		} else {
			res.status(500).send('Ingresso valido não encontrada');
		}
	});
});


ingressoValidoRouter.route('/:dono/:idEvento/:ingressoValidoId')
		.get(function(req, res){
			res.json(req.ingressoValido);
		})
		.delete(function(req, res){
			ingressoValidoController.remover(req, res);
		});
		

module.exports = ingressoValidoRouter;
