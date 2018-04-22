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

ingressoUtilRouter.route('/distribuicaoporconfiguracao/:dono')
		.get(function(req, res){
			console.log('chegou na distribuicao por categoria');
			ingressoController.listarDistribuicaoPorConfiguracao(req.params.dono,req, res);
		});

ingressoUtilRouter.route('/entradasevento/:idEvento')
		.get(function(req, res){
			console.log('chegou na listagem de entradas');
			ingressoController.listarEntradaEventoPorDia(req.params.idEvento,req, res);
		});

ingressoUtilRouter.route('/entradasporcategoria/:idEvento')
		.get(function(req, res){
			ingressoController.listarEntradaEventoPorCategoria(req.params.idEvento,req, res);
		});

ingressoUtilRouter.route('/listarpaginado/:numMaxRegisros/:pagina')
		.get(function(req, res){
			ingressoController.listarPaginado(req.params.numMaxRegisros,req.params.pagina,req, res);
		});


ingressoUtilRouter.route('/distribuicaoporusuario/:idEvento')
		.get(function(req, res){
			ingressoController.listarDistribuicaoPorUsuario(req.params.idEvento,req, res);
		});


ingressoUtilRouter.route('/xls/:idEvento')
		.get(function(req, res){
			
			ingressoController.listarPorCategoriaParaExportacao(req, res);

			/*var jsonArr = [{
			    foo: 'bar',
			    qux: 'moo',
			    poo: 123,
			    stux: new Date()
			},
			{
			    foo: 'bar',
			    qux: 'moo',
			    poo: 345,
			    stux: new Date()
			}];

			res.xls('data.xlsx', jsonArr);*/

		});
		


module.exports = ingressoUtilRouter;
