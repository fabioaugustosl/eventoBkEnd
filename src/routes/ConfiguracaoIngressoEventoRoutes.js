var express = require('express');

var configuracaoIngressoModel = require('../models/ConfiguracaoIngressoEventoModel');

var configuracaoIngressoRouter = express.Router();

var configuracaoIngressoController = require('../controller/ConfiguracaoIngressoEventoController')(configuracaoIngressoModel);


configuracaoIngressoRouter.route('/')
		.post(function(req, res){
			console.log('Chegou no route de configuração');
			configuracaoIngressoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			configuracaoIngressoController.listar(req, res);
		});


configuracaoIngressoRouter.use('/:configuracaoIngressoId', function(req, res, next){
	// esse é nosso middleware
	configuracaoIngressoModel.findById(req.params.configuracaoIngressoId, function(err, configuracaoIngresso){
		if(err){
			res.status(500).send(err);
		} else if(configuracaoIngresso) {
			req.configuracaoIngresso = configuracaoIngresso;
			next();
		} else {
			res.status(404).send('configuracaoIngresso não encontrado');
		}
	});
});


configuracaoIngressoRouter.route('/:configuracaoIngressoId')
		.get(function(req, res){
			res.json(req.configuracaoIngresso);
		})
		.put(function(req, res){
			configuracaoIngressoController.substituir(req, res);
		})
		.patch(function(req, res){
			configuracaoIngressoController.atualizar(req, res);
		})
		.delete(function(req, res){
			configuracaoIngressoController.remover(req, res);
		});
		

module.exports = configuracaoIngressoRouter;
