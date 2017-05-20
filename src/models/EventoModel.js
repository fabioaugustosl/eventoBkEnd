var mongoose = require('mongoose'), Schema = mongoose.Schema;

var eventoModel = new Schema({
	dono: {type:String},
	id: {type:String},
	titulo:{ type:String},
	descricao: {type: String},
	imgDestaque :{type: String},
	data:{ type: Date, default: Date.now },
	dataTermino:{ type: Date },
	horario:{type:String},
	tipoEvento :{type:String}, /*public ou private*/
	categoria: {type:String},
	dataCriacao:{ type: Date, default: Date.now },
	ativo:{type:Boolean, default: true}
});

module.exports = mongoose.model('Evento', eventoModel);