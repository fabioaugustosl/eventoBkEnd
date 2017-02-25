
var moment = require('moment');
var configuracaoIngressoController = function(configuracaoIngressoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo configuracaoIngresso');
		var configuracaoIngresso = new configuracaoIngressoModel(req.body);
		
		console.log(configuracaoIngresso);
		var msgObrigatorio = '';
		if(!req.body.idEvento) {
			msgObrigatorio+= 'Evento é obrigatório.<br/>';
		}
		if(!req.body.tipoIngresso) {
			msgObrigatorio+= 'Tipo do ingresso é obrigatório.<br/>';
		}
		if(!req.body.preco) {
			req.body.preco = 0;
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			configuracaoIngresso.save();
			res.status(201);
			res.send(configuracaoIngresso);	
		}

	};


	var substituir = function(req, res){
		console.log(' ::: Substituir configuracaoIngresso');
		var configuracaoIngresso = req.configuracaoIngresso; // new configuracaoIngressoModel(req.body);
		console.log(configuracaoIngresso);

		configuracaoIngresso.dataInicioVendas = req.body.dataInicioVendas;
		if(configuracaoIngresso.dataInicioVendas){
			configuracaoIngresso.dataInicioVendas = moment(configuracaoIngresso.dataInicioVendas,"DD/MM/YYYY").second(0).millisecond(0).format();
		}
		configuracaoIngresso.dataTerminoVendas = req.body.dataInicioVendas;
		if(configuracaoIngresso.dataTerminoVendas){
			configuracaoIngresso.dataTerminoVendas = moment(configuracaoIngresso.dataTerminoVendas,"DD/MM/YYYY").second(0).millisecond(0).format();
		}
		configuracaoIngresso.tipoIngresso = req.body.tipoIngresso;
		configuracaoIngresso.preco = req.body.preco;
		configuracaoIngresso.quantidadeTotal = req.body.quantidadeTotal;

		req.configuracaoIngresso.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.configuracaoIngresso);
			}
		});
	};


	var atualizar = function(req, res){
		console.log(' ::: Atualizar configuracaoIngresso');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.configuracaoIngresso[p] = req.body[p];	
		}
		
		console.log(req.configuracaoIngresso);
		req.configuracaoIngresso.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.configuracaoIngresso);
			}
		});
	};


	var remover = function(req, res){
		console.log(' ::: Remover configuracaoIngresso');
		req.configuracaoIngresso.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('configuracaoIngresso removido.');
			}
		});
	
	};


	var listar = function(req, res){
		console.log(' ::: Listar configuracaoIngresso');
		var query = {};
		console.log(moment().format()); 	
		if(req.query){
			query = req.query;
			if(query.dataInicioVendas){
				query.dataInicioVendas = moment(query.dataInicioVendas, "DD/MM/YYYY").format();
				console.log(query.dataInicioVendas);
			} 
			if(query.dataTerminoVendas){
			    query.dataTerminoVendas = moment(query.dataTerminoVendas, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).format()
            }
				
			console.log(query);
		}
		configuracaoIngressoModel.find(query, function(err, configuracaoIngressos){
			if(err){
				res.status(500).send(err);
			} else {
				var returnconfiguracaoIngressos = [];
				configuracaoIngressos.forEach(function(element, index, array){
					var configuracaoIngressoObj = element.toJSON();
					configuracaoIngressoObj.links = {};
					configuracaoIngressoObj.links.self = 'http://'+req.headers.host + '/api/configuracaoIngresso/v1/' + configuracaoIngressoObj._id;
					returnconfiguracaoIngressos.push(configuracaoIngressoObj);
				});

				res.json(returnconfiguracaoIngressos);
			}
		});
	};

	return {
		substituir 	: substituir,
		atualizar 	: atualizar,
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = configuracaoIngressoController;