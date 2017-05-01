var mongoose = require('mongoose'), Schema = mongoose.Schema;

var logModel = new Schema({
	dono: {type:String},
	tipo:{ type:String},
	descricao: {type: String},
	data:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logModel);