var express = require('express');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
//var session = require('express-session');
var mongoose = require('mongoose');


var app = express();

var db = mongoose.connect('mongodb://localhost:27018/db_eventos');


var port = process.env.PORT || 3000;

// diretorios publicos
app.use(express.static('public'));

//middlaware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//app.use(cookieParser());
//app.use(session({secret: 'library'}));

//require('./src/config/passport')(app);


app.set('views','./src/views');

// template engine
//app.set('view engine', 'ejs');


//rotas

var eventoRouter = require('./src/routes/EventoRoutes');
var enderecoRouter = require('./src/routes/EnderecoEventoRoutes');
var categoriaRouter = require('./src/routes/CategoriaEventoRoutes');
var configuracaoIngressoRouter = require('./src/routes/ConfiguracaoIngressoEventoRoutes');
var ingressoRouter = require('./src/routes/IngressoRoutes');

app.use('/api/evento/v1', eventoRouter);
app.use('/api/endereco/v1', enderecoRouter);
app.use('/api/categoria/v1', categoriaRouter);
app.use('/api/configuracaoIngresso/v1', configuracaoIngressoRouter);
app.use('/api/ingresso/v1', ingressoRouter);


app.get('/', function(req, res){
	//res.render('index');
	res.send('de buenas');
	console.log('de buenas');
});

// start servidor
app.listen(port, function(err){
	console.log('running avalia on '+port);
});


module.exports = app;

