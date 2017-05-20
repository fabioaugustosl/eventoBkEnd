var mongoose = require('mongoose'), Schema = mongoose.Schema;

var categoriaEventoModel = new Schema({
	dono: {type:String},
	nome:{ type:String}
});

module.exports = mongoose.model('CategoriaEvento', categoriaEventoModel);