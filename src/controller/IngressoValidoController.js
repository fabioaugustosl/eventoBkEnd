

var ingressoValidoController = function(ingressoValidoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Codigo ingresso valido');
		var ingressoValido = new ingressoValidoModel(req.body);
		
		var msgObrigatorio = '';
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.codigo) {
			msgObrigatorio+= 'Código é obrigatório.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			ingressoValido.save();
			res.status(201);
			res.send(ingressoValido);	
		}

	};


	var remover = function(req, res){
		console.log(' ::: Remover ingressoValido');
		req.ingressoValido.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Ingresso valido removido.');
			}
		});
	
	};


	var listar = function(req, res){
		console.log(' ::: Listar Ingresso Valido');
		
		ingressoValidoModel.find(req.query, function(err, ingressoValidos){
			if(err){
				res.status(500).send(err);
			} else {
				var returningressoValidos = [];
				ingressoValidos.forEach(function(element, index, array){
					var ingressoValidoObj = element.toJSON();
					ingressoValidoObj.links = {};
					ingressoValidoObj.links.self = 'http://'+req.headers.host + '/api/ingressoValido/v1/' + ingressoValidoObj._id;
					returningressoValidos.push(ingressoValidoObj);
				});

				res.json(returningressoValidos);
			}
		});
	};

	return {
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = ingressoValidoController;