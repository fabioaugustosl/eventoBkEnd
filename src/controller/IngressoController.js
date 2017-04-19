
var md5 = require('md5');
var moment = require('moment');
var qrcode = require('../util/QRCodeUtil');

var ingressoController = function(ingressoModel, configuracaoIngressoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Ingresso ');
		var ingresso = new ingressoModel(req.body);

		var configuracaoIngresso = new configuracaoIngressoModel();

		console.log(ingresso);
		var msgObrigatorio = '';
	
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.idEvento) {
			msgObrigatorio+= 'Evento é obrigatório.<br/>';
		}
		if(!req.body.nomeCliente) {
			msgObrigatorio+= 'O nome do cliente é obrigatório.<br/>';
		}
		if(!req.body.idCliente) {
			msgObrigatorio+= 'O ID do cliente é obrigatório.<br/>';
		}


		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {

			var qtdMax;
			var qtdMaxPessoa;
			var qtdIngressosJaCadastrados;
			var qtdIngressosPessoa;

			/*configuracaoIngresso.findOne({'idEvento': req.body.idEvento}, function(err, configIngressoEvento){
				console.log('configuração do ingresso para esse evento: ',configIngressoEvento);

				if(!err){
					qtdMax = configIngressoEvento.quantidadeTotal;
					qtdMaxPessoa = configIngressoEvento.quantidadeMaxPorPessoa;
				}
			});
*/
			ingressoModel.where({ 'idEvento': ingresso.idEvento }).count(function (err, count) {
				if(!err){
			  		qtdIngressosJaCadastrados = count;
				}
			});

			ingressoModel.where({ 'idCliente': ingresso.idCliente }).count(function (err, count) {
				if(!err){
			  		qtdIngressosPessoa = count;
				}
			});


			if(!ingresso.quantidade) {
				ingresso.quantidade = 1;
			} 
			if(!ingresso.valorPG) {
				ingresso.valorPG = 0;
			} 
			
			console.log('qtdMax: '+qtdMax);
			console.log('qtdMaxPessoa: '+qtdMaxPessoa);
			console.log('qtdIngressosJaCadastrados: '+qtdIngressosJaCadastrados);
			console.log('qtdIngressosPessoa:'+ qtdIngressosPessoa);


			if(qtdMax && qtdIngressosJaCadastrados 
					&& (qtdIngressosJaCadastrados + ingresso.quantidade) > qtdMax){
				res.status(400);
				res.send('A quantidade máxima de ingressos disponibilizadas para o evento foi atingida.');
			} else if(qtdMaxPessoa && qtdIngressosPessoa 
					&& (qtdIngressosPessoa + ingresso.quantidade) > qtdMaxPessoa){
				res.status(400);
				res.send('A quantidade máxima de ingressos permitido por pessoa foi atingido.');
			} else {
				if(!ingresso.chave){
					//gerar a chave unica do ingresso
					var chave = moment().get('year') ;
					chave += moment().get('date');
					chave += moment().get('hour')
					chave += moment().get('second')
					chave += moment().get('millisecond');
					chave += ingresso.idCliente;
					chave += ingresso.idEvento;
					console.log("Chave: ",chave);

					var hash = md5(chave);
					console.log("Hash: ",hash);
					ingresso.chave = hash;
				}

				qrcode(ingresso.chave , function(urlQRCode){
					ingresso.qrcodeImg = urlQRCode;
					ingresso.save();
					res.status(201);
					res.send(ingresso);
				});
			}
				
		}

	};


	var confirmarEntrada = function(ingresso, req, res){
		console.log(' ::: confirmarEntrada Ingresso - BAIXA');
		//var ingresso = req.ingresso; // new eventoModel(req.body);
		
		console.log(ingresso);

		if(!ingresso.dataBaixa){
			ingresso.dataBaixa = moment().second(0).millisecond(0).format();

			ingresso.save(function(err){
				if(err){
					res.status(500).send("NOK");
				} else {
					res.status(201).send("OK");
				}
			});
		} else {
			res.status(500).send("Já foi registrada a baixa desse ingresso");
		}
	};



	var quantidadePorEvento = function(idEvento, req, res){
		console.log(' ::: Quantidade de Ingressos por Evento');
		
		 ingressoModel.count({'idEvento' : idEvento}, function(err, count) {
		     console.log(count); // this will print the count to console
		     res.send(""+count);
		 });
		
		
	};


	var remover = function(req, res){
		console.log(' ::: Remover Ingresso');

		//if(req.ingresso.dataBaixa){
		//	res.status(500).send("Já foi realizada baixa deste ingresso. Por isso não é autorizado sua deleção.");
		//} else {
			req.ingresso.remove(function(err){
				if(err){
					res.status(500).send(err);
				} else {
					res.status(204).send('ingresso removido.');
				}
			});
		//}
	};


	var listar = function(req, res){
		console.log(' ::: Listar Ingresso ');

		var query = {};

		if(req.query){
			query = req.query;

			console.log('data no listar: ',query.dataBaixa);
			if(query.dataBaixa){
				var dataQuery =  moment(query.dataBaixa).format("YYYY-MM-DDTHH:mm:ss")
				console.log('data query: ', dataQuery);
				
				query.dataBaixa = { $gte: query.dataBaixa }
			}	
		}
		 
		ingressoModel.find(query, function(err, ingressos){
			if(err){
				res.status(500).send(err);
			} else {
				var returningressos = [];
				ingressos.forEach(function(element, index, array){
					var ingressoObj = element.toJSON();
					ingressoObj.links = {};
					ingressoObj.links.self = 'http://'+req.headers.host + '/api/ingresso/v1/' + ingressoObj._id;
					ingressoObj.links.qrcodeImg = "<img src='"+ingressoObj.qrcodeImg+"' alt='"+ingressoObj.chave+"' />";
					returningressos.push(ingressoObj);
				});

				res.json(returningressos);
			}
		});
	};


	var listarDistribuicaoPorDia = function(donoEvento, req, res){
		console.log('entrou na dist');
		ingressoModel.aggregate(
	    [	{
	            "$match": {
	                dono: donoEvento
	            }
        	},
			{ "$group": { 
		        "_id": 
	             {
	               day: {$dayOfMonth: "$dataGeracao"},
	               month: {$month: "$dataGeracao"}, 
	               year: {$year: "$dataGeracao"}
	             }, 
	             "total": {$sum: "$data"},
	             "count": {$sum: 1}
				}},
	        // Sorting pipeline
	        { "$sort": { "count": -1 } },
	        // Optionally limit results
	        { "$limit": 30 }
	    ],
	    function(err,result) {
	    	console.log(result);
	    	res.status(201);
			res.send(result);


	       // Result is an array of documents
	    }
		);
	};

	return {
		quantidadePorEvento : quantidadePorEvento,
		confirmarEntrada	: confirmarEntrada,
		listar 		: listar,
		listarDistribuicaoPorDia : listarDistribuicaoPorDia,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = ingressoController;