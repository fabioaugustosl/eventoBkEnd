var express = require('express');

var logModel = require('../models/LogModel');

var logRouter = express.Router();

var logController = require('../controller/LogController')(logModel);


logRouter.route('/')
		.post(function(req, res){
			logController.salvarNovo(req, res);
		})
		.get(function(req, res){
			logController.listar(req, res);
		});


logRouter.use('/:logId', function(req, res, next){
	// esse é nosso middleware
	logModel.findById(req.params.logId, function(err, log){
		if(err){
			res.status(500).send(err);
		} else if(log) {
			req.log = log;
			next();
		} else {
			res.status(404).send('Log não encontrada');
		}
	});
});


logRouter.route('/:logId')
		.get(function(req, res){
			res.json(req.log);
		})
		.delete(function(req, res){
			logController.remover(req, res);
		});
		

module.exports = logRouter;
