var mongoose = require('mongoose'), Schema = mongoose.Schema;

var ingressoModel = new Schema({
	dono : {type:String},
	idEvento : {type:String},
	idCliente : {type:String},
	dataGeracao : {type: Date, default: Date.now },
	quantidade : {type:Number},
	valorPG : {type:Number},
	chave : {type:String},
	qrcodeImg : {type:String},
	dataBaixa : {type: Date}
});

module.exports = mongoose.model('Ingresso', ingressoModel);