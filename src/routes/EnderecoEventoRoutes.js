var express = require('express');

var enderecoModel = require('../models/EnderecoEventoModel');

var enderecoEventoRouter = express.Router();

var enderecoController = require('../controller/EnderecoEventoController')(enderecoModel);


enderecoEventoRouter.use('/:eventoId', function(req, res, next){
	// esse é nosso middleware
	enderecoModel.findOne({ 'idEvento': req.params.eventoId }, function(err, endereco){
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


enderecoEventoRouter.route('/:eventoId')
		.get(function(req, res){
			res.json(req.endereco);
		});
		

module.exports = enderecoEventoRouter;
