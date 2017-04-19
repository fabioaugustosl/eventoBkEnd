var express = require('express');

var ingressoModel = require('../models/IngressoModel');

var ingressoUtilRouter = express.Router();

var ingressoController = require('../controller/IngressoController')(ingressoModel);



ingressoUtilRouter.route('/quantidade/:idEvento')
		.get(function(req, res){
			console.log('chegou get quantidade');
			ingressoController.quantidadePorEvento(req.params.idEvento, req, res);
		});

ingressoUtilRouter.route('/distribuicao/:dono')
		.get(function(req, res){
			console.log('chegou na distribuicao');
			ingressoController.listarDistribuicaoPorDia(req.params.dono,req, res);
		});





module.exports = ingressoUtilRouter;
