

var categoriaController = function(categoriaModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Categoria');
		var categoria = new categoriaModel(req.body);
		
		//console.log(categoria);
		console.log(req.body);
		var msgObrigatorio = '';
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.nome) {
			msgObrigatorio+= 'Nome é obrigatório.<br/>';
		}

		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			categoria.save();
			res.status(201);
			res.send(categoria);	
		}

	};


	var substituir = function(req, res){
		console.log(' ::: Substituir Categoria');
		var categoria = req.categoria; // new categoriaModel(req.body);
		console.log(categoria);

		categoria.nome = req.body.nome;
		
		req.categoria.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.categoria);
			}
		});
	};


	var atualizar = function(req, res){
		console.log(' ::: Atualizar categoria');
		if(req.body._id){
			delete req.body._id;
		}

		for(var p in req.body){
			req.categoria[p] = req.body[p];	
		}
		
		console.log(req.categoria);
		req.categoria.save(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.json(req.categoria);
			}
		});
	};


	var remover = function(req, res){
		console.log(' ::: Remover Categoria');
		req.categoria.remove(function(err){
			if(err){
				res.status(500).send(err);
			} else {
				res.status(204).send('Categoria removido.');
			}
		});
	
	};


	var listar = function(req, res){
		console.log(' ::: Listar Categoria');
		
		categoriaModel.find(req.query, function(err, categorias){
			if(err){
				res.status(500).send(err);
			} else {
				var returnCategorias = [];
				categorias.forEach(function(element, index, array){
					var categoriaObj = element.toJSON();
					categoriaObj.links = {};
					categoriaObj.links.self = 'http://'+req.headers.host + '/api/categoria/v1/' + categoriaObj._id;
					returnCategorias.push(categoriaObj);
				});

				res.json(returnCategorias);
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

module.exports = categoriaController;