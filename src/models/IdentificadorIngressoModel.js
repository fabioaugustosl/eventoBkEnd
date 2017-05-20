var mongoose = require('mongoose'), Schema = mongoose.Schema;

var idenficadorIngressoModel = new Schema({
	idIngresso:{type:String},
	codigo:{type:String},
	qrcode:{type:String}
});

module.exports = mongoose.model('IdentificadorIngresso', idenficadorIngressoModel);