var express = require('express');

var ingressoModel = require('../models/IngressoModel');

var ingressoUtilRouter = express.Router();

var ingressoController = require('../controller/IngressoController')(ingressoModel);



ingressoUtilRouter.route('/quantidade/:idEvento')
		.get(function(req, res){
			console.log('chegou get quantidade');
			ingressoController.quantidadePorEvento(req.params.idEvento, req, res);
		})



module.exports = ingressoUtilRouter;
