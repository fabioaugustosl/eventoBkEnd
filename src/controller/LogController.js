

var logController = function(logModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Log');
		var logg = new logModel(req.body);
		
		var msgObrigatorio = '';
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.tipo) {
			msgObrigatorio+= 'Tipo é obrigatório.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			logg.save();
			res.status(201);
			res.send(logg);	
		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover logg');
		req.logg.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('logg removido.');
			}
		});
	
	};


	var listar = function(req, res){
		console.log(' ::: Listar logg');
		
		logModel.find(req.query, function(err, loggs){
			if(err){
				res.status(500).send(err);
			} else {
				var returnloggs = [];
				loggs.forEach(function(element, index, array){
					var loggObj = element.toJSON();
					loggObj.links = {};
					loggObj.links.self = 'http://'+req.headers.host + '/api/logg/v1/' + loggObj._id;
					returnloggs.push(loggObj);
				});

				res.json(returnloggs);
			}
		});
	};

	return {
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = logController;