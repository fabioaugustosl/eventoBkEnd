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


//outra solução q nao cheguei a testar
//var cors = require('cors');

// use it before all route definitions
//app.use(cors({origin: 'http://localhost:8888'}));

//isso funcionou localhost
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//app.use(cookieParser());
//app.use(session({secret: 'library'}));

//require('./src/config/passport')(app);


app.set('views','./src/views');

// template engine
//app.set('view engine', 'ejs');


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

app.use('/api/evento/v1', eventoRouter);
app.use('/api/endereco/v1', enderecoRouter);
app.use('/api/enderecoEvento/v1', enderecoRouter);
app.use('/api/categoria/v1', categoriaRouter);
app.use('/api/configuracaoIngresso/v1', configuracaoIngressoRouter);
app.use('/api/ingresso/v1', ingressoRouter);
app.use('/api/ingressoBaixa/v1/', ingressoBaixaRouter);
app.use('/api/ingressoUtil/v1/', ingressoUtilRouter);
app.use('/api/log/v1/', logRouter);


app.get('/', function(req, res){
	//res.render('index');
	res.send('de buenas');
	console.log('de buenas');
});

// start servidor
app.listen(port, function(err){
	console.log('running evento on '+port);
});


module.exports = app;

