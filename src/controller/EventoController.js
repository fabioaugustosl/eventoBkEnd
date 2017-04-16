
var moment = require('moment');
var eventoController = function(eventoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo ');
		var evento = new eventoModel(req.body);
		
		console.log(evento);
		var msgObrigatorio = '';
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.titulo) {
			msgObrigatorio+= 'Título é obrigatório.<br/>';
		}
		if(!req.body.data) {
			msgObrigatorio+= 'Data do evento é obrigatório.<br/>';
		}

		//if(!req.body.loginAvaliado) {
		//	res.status(400);
		//	res.send('Login do avaliado obrigatório');
		//} 

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			evento.dataCriacao = moment().second(0).millisecond(0).format();
			evento.save();
			
			res.status(201);
			res.send(evento);	
		}

	};


	var substituir = function(req, res){
		console.log(' ::: Substituir ');
		var evento = req.evento; // new eventoModel(req.body);
		console.log(evento);

		evento.data = req.body.data;
		if(evento.data){
			evento.data = moment(evento.data,"DD/MM/YYYY").second(0).millisecond(0).format();
		}
		if(evento.dataTermino){
			evento.dataTermino = moment(evento.dataTermino,"DD/MM/YYYY").second(0).millisecond(0).format();
		}
		evento.titulo = req.body.titulo;
		evento.descricao = req.body.descricao;
		evento.imgDestaque = req.body.imgDestaque;
		evento.horario = req.body.horario;
		evento.tipoEvento = req.body.tipoEvento;
		evento.categoria = req.body.categoria;
		evento.ativo = req.body.ativo;

		req.evento.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(201).send(evento);
			}
		});
	};


	var atualizar = function(req, res){
		console.log(' ::: Atualizar ');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.evento[p] = req.body[p];	
		}
		
		console.log(req.evento);
		req.evento.save(function(err){
			console.log('call back atu');
			if(err){
				res.status(500).send(err);
			} else {
				console.log('vai retornar 201');
				res.status(201).send();
			}
		});
	};


	var remover = function(req, res){
		console.log(' ::: Remover Evento');
		req.evento.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Evento removido.');
			}
		});
	
	};


	var listar = function(req, res){
		console.log(' ::: Listar evento');
		var query = {};
		console.log(moment().format()); 	
		if(req.query){
			query = req.query;
			if(query.data){
				query.data = moment(query.data, "DD/MM/YYYY").format();
				console.log(query.data);
			} else if(query.dataTermino){
                query.dataTermino = moment(query.dataFim, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).format()
            }


			if(query.dataDe && query.dataAte){
				query.data = {
                    $gte: moment(query.dataDe, "DD/MM/YYYY").hour(0).minute(0).second(0).millisecond(0).format(),
                }
                query.data = {
                    $lte: moment(query.dataAte, "DD/MM/YYYY").hour(23).minute(59).second(59).millisecond(999).format()
                }
			} 
			delete query.dataDe;
			delete query.dataAte;
				
		}

		eventoModel.find(query, function(err, eventos){
			if(err){
				res.status(500).send(err);
			} else {
				var returnEventos = [];
				eventos.forEach(function(element, index, array){
					var eventoObj = element.toJSON();
					eventoObj.links = {};
					eventoObj.links.self = 'http://'+req.headers.host + '/api/evento/v1/' + eventoObj._id;
					returnEventos.push(eventoObj);
				});

				console.log(returnEventos);
				res.json(returnEventos);
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

module.exports = eventoController;