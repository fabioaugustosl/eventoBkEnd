var mongoose = require('mongoose'), Schema = mongoose.Schema;

var ingressoValidoModel = new Schema({
	dono: {type:String},
	idEvento:{ type:String},
	codigo: {type: String}
});

module.exports = mongoose.model('IngressoValido', ingressoValidoModel);