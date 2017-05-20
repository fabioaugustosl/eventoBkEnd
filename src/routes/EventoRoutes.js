var express = require('express');

var eventoModel = require('../models/EventoModel');

var eventoRouter = express.Router();

var eventoController = require('../controller/EventoController')(eventoModel);


eventoRouter.route('/')
		.post(function(req, res){
			eventoController.salvarNovo(req, res);
		})
		.get(function(req, res){
			eventoController.listar(req, res);
		});


eventoRouter.use('/:eventoId', function(req, res, next){
	// esse é nosso middleware
	eventoModel.findById(req.params.eventoId, function(err, evento){
		if(err){
			res.status(500).send(err);
		} else if(evento) {
			req.evento = evento;
			next();
		} else {
			res.status(404).send('Evento não encontrado');
		}
	});
});


eventoRouter.route('/:eventoId')
		.get(function(req, res){
			res.json(req.evento);
		})
		.put(function(req, res){
			eventoController.substituir(req, res);
		})
		.patch(function(req, res){
			eventoController.atualizar(req, res);
		})
		.delete(function(req, res){
			eventoController.remover(req, res);
		});
		

module.exports = eventoRouter;
