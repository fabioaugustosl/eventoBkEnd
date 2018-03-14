var express = require('express');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
//var session = require('express-session');
var mongoose = require('mongoose');


var app = express();

var db = mongoose.connect('mongodb://localhost/db_eventos');  


var port = process.env.PORT || 3000;

// diretorios publicos
app.use(express.static('public'));

//middlaware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// cors
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


//rotas

var eventoRouter = require('./src/routes/EventoRoutes');
var enderecoRouter = require('./src/routes/EnderecoEventoRoutes');
var enderecoEventoRouter = require('./src/routes/EnderecoEventoRoutes');
var categoriaRouter = require('./src/routes/CategoriaEventoRoutes');
var configuracaoIngressoRouter = require('./src/routes/ConfiguracaoIngressoEventoRoutes');
var ingressoRouter = require('./src/routes/IngressoRoutes');
var ingressoBaixaRouter = require('./src/routes/IngressoBaixaRoutes');
var ingressoUtilRouter = require('./src/routes/IngressoUtilRoutes');
var logRouter = require('./src/routes/LogRoutes');
var ingressoValidoRouter = require('./src/routes/IngressoValidoRoutes');

app.use('/api/evento/v1', eventoRouter);
app.use('/api/endereco/v1', enderecoRouter);
app.use('/api/enderecoevento/v1', enderecoRouter);
app.use('/api/categoria/v1', categoriaRouter);
app.use('/api/configuracaoingresso/v1', configuracaoIngressoRouter);
app.use('/api/ingresso/v1', ingressoRouter);
app.use('/api/ingressobaixa/v1/', ingressoBaixaRouter);
app.use('/api/ingressoutil/v1/', ingressoUtilRouter);
app.use('/api/log/v1/', logRouter);
app.use('/api/ingressovalido/v1/', ingressoValidoRouter);


app.get('/', function(req, res){
	//res.render('index');
	res.send('de buenas evento api');
	console.log('de buenas evento api');
});

// start servidor
app.listen(port, function(err){
	console.log('running evento on '+port);
});


module.exports = app;

