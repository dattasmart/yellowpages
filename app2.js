var request   = require('request');
var endOfLine = require('os').EOL;
var express   = require('express');
var app       = express();
var mongoose 	= require('mongoose');
var cheerio   = require('cheerio');

// Conexión con la base de datos
mongoose.connect('mongodb://localhost:27017/yellow-pages');

// Definición de modelos
var Listado = mongoose.model('Listado', {
	name: String,
	email: String
});

// Core functionality
var page = 1;
var web = 'http://localhost:8080/pagina' + page + '.html';
var url = web;

var nextPage = true;

var options = {
    url: url,
    headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
    }
};

function logError(err) {
	if(err) {
        console.log(err);
    } 
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
		var emails = '';
		var name   = '';

		var $ = cheerio.load(body);

		$('.m-results-business').each(function(){
			name = $('.m-results-business--name > a' , this).text();
			emails = $('.questionData', this).attr('value') + endOfLine;
	    	Listado.create({
	    		name: name,	
	    		email: emails
	    	}, 
	    		function(err, todo){
					if(err) 
						res.send(err);
				}
			);
		});

		if ($('li.last span.visuallyHidden').length > 0){
			page += 1;
			options.url = 'http://localhost:8080/pagina' + page + '.html';
			request(options, callback);		
		}
	}
	else {
		console.log(error);
	};
};
// End core functionality

// Configuración
app.configure(function() {
	app.use(express.static(__dirname + '/public'));		// Localización de los ficheros estáticos
	app.use(express.logger('dev'));						// Muestra un log de todos los request en la consola
	app.use(express.bodyParser());						// Permite cambiar el HTML con el método POST
	app.use(express.methodOverride());					// Simula DELETE y PUT
});

// Rutas de nuestro API
app.get('/api/todos', function(req, res) {				// GET de todos los TODOs
	Listado.find(function(err, listados) {
		if(err){
			res.send(err);
		}
		res.json(listados);
	});
});

app.post('/api/todos', function(req, res) {				// POST que crea un TODO y devuelve todos tras la creación
	page = 1;
	city = req.body.city;
	what = req.body.what;
	options.url = 'http://localhost:8080/pagina' + page + '.html';
	request(options, callback);
	Listado.find(function(err, listados) {
		if(err){
			res.send(err);
		}
		res.json(listados);
	});
});

app.delete('/api/todos/', function(req, res) {		// DELETE un TODO específico y devuelve todos tras borrarlo.
	Listado.remove({}, function(err, retistro) {
		if(err){
			res.send(err);
		}

		Listado.find(function(err, registros) {
			if(err){
				res.send(err);
			}
			res.json(registros);
		});

	})
});

app.get('*', function(req, res) {						// Carga una vista HTML simple donde irá nuesta Single App Page
	res.sendfile('./public/index.html');				// Angular Manejará el Frontend
});

// Escucha y corre el server
app.listen(3000, function() {
	console.log('App listening on port 3000');
});