var mongoose = require('mongoose'), Schema = mongoose.Schema;

var configuracaoIngressoEventoModel = new Schema({
	idEvento:{type:String},
	tipoIngresso:{ type:String},  /*unico, meia-entrada, vip, etc*/
	preco:{ type:Number},
	quantidadeTotal:{ type:Number},
	dataInicioVendas: {type: Date},
	dataTerminoVendas: {type: Date}
});

module.exports = mongoose.model('ConfiguracaoIngressoEvento', configuracaoIngressoEventoModel);