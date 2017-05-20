var express = require('express');

var enderecoModel = require('../models/EnderecoEventoModel');

var enderecoRouter = express.Router();

var enderecoController = require('../controller/EnderecoEventoController')(enderecoModel);


enderecoRouter.route('/')
		.post(function(req, res){
			enderecoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			enderecoController.listar(req, res);
		});


enderecoRouter.use('/:enderecoId', function(req, res, next){
	// esse é nosso middleware
	enderecoModel.findById(req.params.enderecoId, function(err, endereco){
		if(err){
			res.status(500).send(err);
		} else if(endereco) {
			req.endereco = endereco;
			next();
		} else {
			res.status(404).send('Endereço não encontrado');
		}
	});
});


enderecoRouter.route('/:enderecoId')
		.get(function(req, res){
			res.json(req.endereco);
		})
		.put(function(req, res){
			enderecoController.substituir(req, res);
		})
		.patch(function(req, res){
			enderecoController.atualizar(req, res);
		})
		.delete(function(req, res){
			enderecoController.remover(req, res);
		});
		

module.exports = enderecoRouter;
