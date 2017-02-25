

var enderecoController = function(enderecoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Endereço ');
		var endereco = new enderecoModel(req.body);
		
		console.log(endereco);
		var msgObrigatorio = '';
		if(!req.body.idEvento) {
			msgObrigatorio+= 'Evento é obrigatório.<br/>';
		}
		if(!req.body.logradouro) {
			msgObrigatorio+= 'Logradouro é obrigatório.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			endereco.save();
			res.status(201);
			res.send(endereco);	
		}

	};


	var substituir = function(req, res){
		console.log(' ::: Substituir Endereço');
		var endereco = req.endereco; // new enderecoModel(req.body);
		console.log(endereco);

		endereco.logradouro = req.body.logradouro;
		endereco.numero = req.body.numero;
		endereco.complemento = req.body.complemento;
		endereco.cep = req.body.cep;
		endereco.bairro = req.body.bairro;
		endereco.cidade = req.body.cidade;
		endereco.estado = req.body.estado;
		endereco.descricao = req.body.descricao;

		req.endereco.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.endereco);
			}
		});
	};


	var atualizar = function(req, res){
		console.log(' ::: Atualizar Endereço');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.endereco[p] = req.body[p];	
		}
		
		console.log(req.endereco);
		req.endereco.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.endereco);
			}
		});
	};


	var remover = function(req, res){
		console.log(' ::: Remover endereco');
		req.endereco.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Endereço removido.');
			}
		});
	
	};


	var listar = function(req, res){
		console.log(' ::: Listar endereco');
		
		enderecoModel.find(req.query, function(err, enderecos){
			if(err){
				res.status(500).send(err);
			} else {
				var returnEnderecos = [];
				enderecos.forEach(function(element, index, array){
					var enderecoObj = element.toJSON();
					enderecoObj.links = {};
					enderecoObj.links.self = 'http://'+req.headers.host + '/api/endereco/v1/' + enderecoObj._id;
					returnEnderecos.push(enderecoObj);
				});

				res.json(returnEnderecos);
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

module.exports = enderecoController;