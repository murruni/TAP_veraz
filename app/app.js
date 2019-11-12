// express
var compression = require('compression');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

const myMiddlewares = require('./middlewares');

// middlewares compress all responses & parse application/json
app.use(compression());
app.use(bodyParser.json());
/*
// middleware log to console all request
app.use((req, res, next) => {
    console.log(`${req.method}: ${req.path}`);
    next();
});
*/
// ni bien entra a la aplicacion, valido que sea un usuario logueado
app.use(myMiddlewares.validarToken);

// middleware api routes
app.use('/', require('./veraz.route'));

// middleware for others routes and verbs
app.all('/*', function (req, res, next) {
    res.status(501).send({ error: 'No implementado' });
    return ;
});

// error handler
app.use(function (err, req, res, next) {
    return res.status(err.code || 500 ).send({ error: err.message });
});

module.exports = app;