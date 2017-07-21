var mongoose = require('mongoose'), Schema = mongoose.Schema;

var ingressoModel = new Schema({
	dono : {type:String},
	idEvento : {type:String},
	idConfiguracao : {type:String},
	nomeEvento : {type:String},
	idCliente : {type:String},
	nomeCliente : {type:String},
	docCliente1 : {type:String},
	docCliente2 : {type:String},
	docCliente3 : {type:String},
	acompanhante : {type:String},
	dataGeracao : {type: Date, default: Date.now },
	quantidade : {type:Number},
	valorPG : {type:Number},
	chave : {type:String},
	qrcodeImg : {type:String},
	bloqueado : {type:Boolean, default: false},
	dataBaixa : {type: Date},
	guicheBaixa : {type: String},
	responsavelBaixa : {type: String},
	responsavelDistribuicao : {type: String}
});

module.exports = mongoose.model('Ingresso', ingressoModel);