var mongoose = require('mongoose'), Schema = mongoose.Schema;

var enderecoEventoModel = new Schema({
	idEvento:{type:String},
	logradouro:{ type:String},
	numero:{ type:String},
	complemento:{ type:String},
	bairro:{ type:String},
	cep:{ type:String},
	cidade:{ type:String},
	estado:{ type:String},
	descricao:{ type:String}
});

module.exports = mongoose.model('EnderecoEvento', enderecoEventoModel);