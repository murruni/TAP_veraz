// express
var compression = require('compression');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

const myMiddlewares = require('./utils/middleware');
const ErrorHandler = require('./utils/error');

// middlewares compress all responses & parse application/json
app.use(compression());
app.use(bodyParser.json());

// middleware log to console all request
app.use((req, res, next) => {
    console.log(`${req.method}: ${req.path} ${JSON.stringify(req.query)} ${JSON.stringify(req.body)}`);
    next();
});

// ni bien entra a la aplicacion, valido que sea un usuario logueado
app.use(myMiddlewares.validarToken);

// middleware api routes
app.use('/', require('./routes/veraz'));

// middleware for others routes and verbs
app.all('/*', function (req, res, next) {
    next(new ErrorHandler(501, 'No implementado'));
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.code || 500).send({ error: (err.message || 'Error no especificado') });
});

module.exports = app;