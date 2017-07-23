
var md5 = require('md5');
var moment = require('moment');
var Promise = require('promise');
var q = require('q');
var qrcode = require('../util/QRCodeUtil');

var ingressoController = function(ingressoModel, configuracaoIngressoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Ingresso ');
		var ingresso = new ingressoModel(req.body);

		var configuracaoIngresso = null;

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
			var qtdIngressosPessoaNaConfiguracao;

			if(!ingresso.quantidade) {
				ingresso.quantidade = 1;
			} 
			if(!ingresso.valorPG) {
				ingresso.valorPG = 0;
			} 

			var recuperarConfiguracaoDoIngresso = function() {
			  	var deferred = q.defer();

			  	configuracaoIngressoModel.findById(ingresso.idConfiguracao, function(err, configuracao){
					if(!err){
						deferred.resolve(configuracao);
					}
				});

			  	return deferred.promise;
			};

			var recuperarMaxIngressosEvento = function() {
			  var deferred = q.defer();
			  
			  ingressoModel.where({ 'idEvento': ingresso.idEvento , 'idConfiguracao': ingresso.idConfiguracao}).count(function (err, count) {
				console.log('callback do count idEvento :', count );
					if(!err){
				  		
				  		deferred.resolve(count);
					}
				});

			  return deferred.promise;
			};

			var recuperarMaxIngressosPessoa = function() {
			  var deferred = q.defer();
			  
			  ingressoModel.where({ 'idCliente': ingresso.idCliente , 'idConfiguracao': ingresso.idConfiguracao}).count(function (err, count) {
					console.log('callback do count idCliente :', count );
					if(!err){
				  		deferred.resolve(count);
					}
				});

			  return deferred.promise;
			};


			var salvarNovoIngresso = function() {
				qtdMax = configuracaoIngresso.quantidadeTotal;
				qtdMaxPessoa = configuracaoIngresso.quantidadeMaxPorPessoa;
				
				console.log('qtdMax: '+qtdMax);
				console.log('qtdMaxPessoa: '+qtdMaxPessoa);
				console.log('qtdIngressosJaCadastrados: '+qtdIngressosJaCadastrados);
				console.log('qtdIngressosPessoa:'+ qtdIngressosPessoaNaConfiguracao);

				if(qtdMax && qtdIngressosJaCadastrados 
						&& (qtdIngressosJaCadastrados + ingresso.quantidade) > qtdMax){
					console.log('ERRO: A quantidade máxima de ingressos disponibilizadas para o evento na categoria');
					res.status(400);
					res.end('A quantidade máxima de ingressos disponibilizadas para o evento na categoria '+configuracaoIngresso.tipoIngresso+' foi atingida.');
				} else if(qtdMaxPessoa && qtdIngressosPessoaNaConfiguracao 
						&& (qtdIngressosPessoaNaConfiguracao + ingresso.quantidade) > qtdMaxPessoa){
					console.log('ERRO: A quantidade máxima de ingressos permitido por pessoa na categoria ');
					res.status(400);
					res.end('A quantidade máxima de ingressos permitido por pessoa na categoria '+configuracaoIngresso.tipoIngresso+' foi atingida.');
				} else {
					console.log('Chave ingresso: ', ingresso.chave);
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

						// se não tinha codigo pre-estabelecido salva direto.
						salvarNovoIngressoDefinitivamente(ingresso);
					} else {
						// se já tem codigo preenchido verifica se o codigo já foi usado ... se não salva
						ingressoModel.where({ 'chave': ingresso.chave}).count(function (err, count) {
							
							if(err){
								console.log("ERRO: erro louco ao tentar validar se o código do ingresso já foi utilizado.");
						  		res.status(402).end(err);
							} else {
								if(count > 0){
									console.log("ERRO: código "+ingresso.chave+" do ingresso já foi utilizado.");
									res.status(403);
									res.end('O ingresso códido '+ingresso.chave+' já foi utilizado anteriormente.');
								} else {
									salvarNovoIngressoDefinitivamente(ingresso);
								}	
							}
							
						});

					}
					
				}
			};


			var salvarNovoIngressoDefinitivamente = function(ingresso){
				qrcode(ingresso.chave , function(urlQRCode){
						console.log('ENTROU NO SALVAR DEFINITIVAMENTE');
						ingresso.qrcodeImg = urlQRCode;
						ingresso.save();
						console.log('salvou ');
						res.status(201);
						res.send(ingresso);
					});
			};


			recuperarConfiguracaoDoIngresso().then(function(configuracao) {
				console.log('recuperou a configuracao do evento: ', configuracao);
				configuracaoIngresso  = configuracao;

				recuperarMaxIngressosEvento().then(function(total) {
					console.log('recuperou o total do evento', total);
	 				qtdIngressosJaCadastrados = total;
	 		
		 			recuperarMaxIngressosPessoa().then(function(total) {
		 				console.log('recuperou o total por pessoa', total);
						qtdIngressosPessoaNaConfiguracao = total;

						salvarNovoIngresso();

		 			});

				});
			});
				
		}

	};


	var confirmarEntrada = function(ingresso, req, res){
		console.log(' ::: confirmarEntrada Ingresso - BAIXA');
		//var ingresso = req.ingresso; // new eventoModel(req.body);
		
		
		if(ingresso.dataBaixa){
			console.log(' ::: Ingresso já foi baixado anteriormente');
			res.status(500).send("ENTRADA NÃO PERMITIDA. Já foi registrada a baixa desse ingresso.");
		} else if(ingresso.bloqueado){
			console.log(' ::: Ingresso já foi bloqueado');
			res.status(500).send("ENTRADA NÃO PERMITIDA. Ingresso bloqueado! Favor procurar a coordenação.");
		} else {
			ingresso.dataBaixa = moment().utc(new Date()).format();		
			console.log('data que vai rolar a baixa : ', ingresso);

			ingresso.save(function(err){
				if(err){
					res.status(500).send("NOK");
				} else {
					res.status(201).send("OK");
				}
			});
			
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

		var query = [];

		if(req.query){

			if(req.query.idEvento){
				query.push({idEvento : req.query.idEvento});
			}

			if(req.query.idConfiguracao){
				query.push({idConfiguracao : req.query.idConfiguracao});
			}
			
			if(req.query.dono){
				query.push({dono : req.query.dono});
			}

			if(req.query.docCliente1){
				query.push({docCliente1 : req.query.docCliente1});
			}
			
			if(req.query.docCliente2){
				query.push({docCliente2 : req.query.docCliente2});
			}

			if(req.query.idCliente){
				query.push({idCliente : req.query.idCliente});
			}

			if(req.query.chave){
				query.push({chave : req.query.chave});
			}

			if(req.query.nomeCliente){
				query.push({nomeCliente : RegExp(req.query.nomeCliente, "i") });
			}

			if(req.query.responsavelDistribuicao){
				query.push({responsavelDistribuicao : RegExp(req.query.responsavelDistribuicao, "i") });
			}

			if(req.query.dataGeracao){
				query.push({dataGeracao : moment(query.data, "DD/MM/YYYY").format() });
			}
						
			
			//console.log('data no listar: ',query.dataBaixa);
			if(req.query.dataBaixa){
				var dataQuery =  moment(req.query.dataBaixa).format();
				//console.log('data query: ', dataQuery);
				query.push({dataBaixa : { $gte: dataQuery } });	
			}
		}
		 
		console.log(query);
		var queryFinal = {};
		if(query && query.length > 0){
			queryFinal = { $and: query };
		}

		var numMaxRegistros = 300;
		
		ingressoModel.find(	queryFinal)
				.sort({ "dataGeracao": -1 })
				.limit(numMaxRegistros)
    			.exec(function(err, ingressos){
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



	var listarPaginado = function(numMaxRegistros, pagina, req, res){
		console.log(' ::: Listar Ingresso paginado ',numMaxRegistros," - ", pagina);
		var skipVar = (pagina *numMaxRegistros);
	
		ingressoModel.find(req.query).sort('chave')
				.limit(numMaxRegistros)
    			.skip(skipVar)
    			
    			.exec( function(err, ingressos){
					if(err){
						res.status(500).send(err);
					} else {
						var returningressos = [];
						ingressos.forEach(function(element, index, array){
							var ingressoObj = element.toJSON();
							ingressoObj.dataDistribuicao = moment(ingressoObj.dataGeracao).utcOffset('-0300').format("DD/MM/YYYY");
							ingressoObj.horaDistribuicao = moment(ingressoObj.dataGeracao).utcOffset('-0300').format("HH:mm");

							if(ingressoObj.dataBaixa){
								ingressoObj.dataEntrada = moment(ingressoObj.dataBaixa).utcOffset('-0300').format("DD/MM/YYYY");
								ingressoObj.horaEntrada = moment(ingressoObj.dataBaixa).utcOffset('-0300').format("HH:mm");	
							}
							
							//ingressoObj.links = {};
							//ingressoObj.links.self = 'http://'+req.headers.host + '/api/ingresso/v1/' + ingressoObj._id;
							//ingressoObj.links.qrcodeImg = "<img src='"+ingressoObj.qrcodeImg+"' alt='"+ingressoObj.chave+"' />";
							returningressos.push(ingressoObj);
						});

						res.json(returningressos);
					}
				}); 
	};



	var listarDistribuicaoPorDia = function(donoEvento, req, res){
		console.log('entrou na dist');
		var arrayIdsConfigNao = ["5942f2bb7c86f30035563cae", "5942f2d97c86f30035563caf"];
		ingressoModel.aggregate(
	    [	{
	            "$match": {
	                dono: donoEvento
	                ,idConfiguracao : { "$nin": arrayIdsConfigNao } 
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
	        { "$sort": { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
	        //{"$sort": { "dataGeracao": 1} },
	        // Optionally limit results
	        { "$limit": 90 }
	    ],
	    function(err,result) {
	    	console.log(result);
	    	res.status(201);
			res.send(result);


	       // Result is an array of documents
	    }
		);
	};


	var listarDistribuicaoPorConfiguracao = function(donoEvento, req, res){
		console.log('entrou na dist por categoria');
		ingressoModel.aggregate(
	    [	{
	            "$match": {
	                dono: donoEvento
	            }
        	},
			{ "$group": { 
		        "_id": "$idConfiguracao",
	            "total": {$sum: 1}
			}},
	        // Sorting pipeline
	        { "$sort": { "dataGeracao": -1 } },
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

	
	var listarEntradaEventoPorCategoria = function(idEventoAtual, req, res){
		console.log('entrou na listagem de entradas por evento por categoria');
		ingressoModel.aggregate(
		    [	{
		            "$match": {
		                idEvento: idEventoAtual,
		                dataBaixa : { $ne: null }
		            }
	        	},
				{ "$group": { 
			        "_id": {  configuracao: "$idConfiguracao" , clientesUnicos:  "$idCliente"  },
			        //"cliente": { $sum: "$idCliente" },
		            "total": {$sum: 1}
				}},
		        // Sorting pipeline
		        { "$sort": { "_id": 1 } },
		        // Optionally limit results
		        { "$limit": 99 }
		    ],
		    function(err,result) {
		    	
		    	var retorno = [];
		    	var retornoTotalIngressos = [];

		    	console.log(result);
		    	for (i = 0; i < result.length; i++) { 
		        	var dado = result[i];
		        	//console.log(dado);
		        	var qtdCateg = retorno[dado._id.configuracao];
		        	var qtdTotalCateg = retornoTotalIngressos[dado._id.configuracao];
		        	
		        	if(!qtdCateg){
		        		qtdCateg = 0; 
		        	}
		        	if(!qtdTotalCateg){
		        		qtdTotalCateg = 0; 
		        	}
		        	qtdCateg++;
		        	qtdTotalCateg = qtdTotalCateg+dado.total;
		        	
		        	retorno[dado._id.configuracao] = qtdCateg;
		        	retornoTotalIngressos[dado._id.configuracao] = qtdTotalCateg;
		    	}

		    	var retornoDoidao = [];
		    	if(retorno){
		    		var jsonObjetoRet = {};
		    		var cont = 0;
		    		for (var key in retorno) {
					    var value = retorno[key];
					    jsonObjetoRet.categoria = key;
					    jsonObjetoRet.totaUnico = value;
					    jsonObjetoRet.totalIngressos = retornoTotalIngressos[key];
						retornoDoidao[cont++] = jsonObjetoRet;
					}
		    	}

		    	console.log(retornoDoidao);

		    	res.status(201);
				res.send(retornoDoidao);

		       // Result is an array of documents
		    }
		);
	};


	
	var listarEntradaEventoPorDia = function(idEventoAtual, req, res){
		console.log('entrou na listagem de entradas por evento');
		ingressoModel.aggregate(
	    [	{
	            "$match": {
	                idEvento: idEventoAtual,
	                dataBaixa : { $ne: null }
	            }
        	},
			{ "$group": { 
		        "_id": 
	             {
	               	day: {$dayOfMonth: "$dataBaixa"},
	               	hour: {$hour: "$dataBaixa"}
	               	/*,
	       			minutes: { $minute: "$dataBaixa" },
	       			seconds: { $second: "$dataBaixa" }*/
	             }, 
	             "total": {$sum: 1}
			}},
	        // Sorting pipeline
	        { "$sort": { "dataBaixa": 1 } },
	        // Optionally limit results
	        { "$limit": 99 }
	    ],
	    function(err,result) {
	    	console.log(result);
	    	res.status(201);
			res.send(result);

	       // Result is an array of documents
	    }
		);
	};


	var atualizar = function(req, res){
		console.log(' ::: Atualizar ingresso');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.ingresso[p] = req.body[p];	
		}
		
		console.log(req.ingresso);
		req.ingresso.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.ingresso);
			}
		});
	};


	return {
		quantidadePorEvento : quantidadePorEvento,
		confirmarEntrada	: confirmarEntrada,
		listar 		: listar,
		listarPaginado : listarPaginado,
		listarDistribuicaoPorDia : listarDistribuicaoPorDia,
		listarDistribuicaoPorConfiguracao : listarDistribuicaoPorConfiguracao,
		listarEntradaEventoPorDia : listarEntradaEventoPorDia, 
		listarEntradaEventoPorCategoria : listarEntradaEventoPorCategoria,
		remover 	: remover,
		atualizar : atualizar,
		salvarNovo 	: salvarNovo
	};

};

module.exports = ingressoController;