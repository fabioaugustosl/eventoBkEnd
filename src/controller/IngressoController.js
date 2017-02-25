
var md5 = require('md5');
var moment = require('moment');
var qrcode = require('../util/QRCodeUtil');

var ingressoController = function(ingressoModel){

	var salvarNovo = function(req, res){
		console.log(' ::: Salvar Novo Ingresso ');
		var ingresso = new ingressoModel(req.body);
		
		console.log(ingresso);
		var msgObrigatorio = '';
	
		if(!req.body.dono) {
			msgObrigatorio+= 'Dono é obrigatório.<br/>';
		}
		if(!req.body.idEvento) {
			msgObrigatorio+= 'Evento é obrigatório.<br/>';
		}
		if(!req.body.idCliente) {
			msgObrigatorio+= 'Cliente é obrigatório.<br/>';
		}


		if(msgObrigatorio != '') {
			res.status(400);
			res.send(msgObrigatorio);
		} else {
			if(!ingresso.quantidade) {
				ingresso.quantidade = 1;
			} 
			if(!ingresso.valorPG) {
				ingresso.valorPG = 0;
			} 
			

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


			qrcode(hash, function(urlQRCode){
				ingresso.qrcodeImg = urlQRCode;
				ingresso.save();
				res.status(201);
				res.send(ingresso);
			});
				
		}

	};


	var confirmarEntrada = function(ingresso, req, res){
		console.log(' ::: confirmarEntrada Ingresso - BAIXA');
		//var ingresso = req.ingresso; // new eventoModel(req.body);
		
		console.log(ingresso);

		ingresso.dataBaixa = moment().second(0).millisecond(0).format();

		ingresso.save(function(err){
			if(err){
				res.status(500).send("false");
			} else {
				res.status(201).send("true");
			}
		});
	};


	var remover = function(req, res){
		console.log(' ::: Remover Ingresso');

		if(req.ingresso.dataBaixa){
			res.status(500).send("Já foi realizada baixa deste ingresso. Por isso não é autorizado sua deleção.");
		} else {
			req.ingresso.remove(function(err){
				if(err){
					res.status(500).send(err);
				} else {
					res.status(204).send('ingresso removido.');
				}
			});
		}
	};


	var listar = function(req, res){
		console.log(' ::: Listar Ingresso ');

		ingressoModel.find(req.query, function(err, ingressos){
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

	return {
		confirmarEntrada	: confirmarEntrada,
		listar 		: listar,
		remover 	: remover,
		salvarNovo 	: salvarNovo
	};

};

module.exports = ingressoController;