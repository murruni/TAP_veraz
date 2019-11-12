const GATEWAY_PORT = process.env.GATEWAY_PORT || 3000;
const GATEWAY_HOST = process.env.GATEWAY_HOST || 'localhost';
const GATEWAY_URL = 'http://' + GATEWAY_HOST + ':' + GATEWAY_PORT;
const TOKEN_PATH = '/validate'
const COUNTER_PATH = '/count'

var request = require('request');

// middleware validacion de token
exports.validarToken = function (req, res, next) {
    var options = {
        url: GATEWAY_URL + TOKEN_PATH
        , headers: { 'Authorization': (req.headers.authorization || '') }
    };

    function callback(error, response, body) {
        if (error) {
            var err = new Error('Error de conexión al validador de usuario');
            err.code = 500;
            next(err);
        } else {
            var data = JSON.parse(body);
            if (response.statusCode == 200) {
                next();
            }
            else {
                var err = new Error(data.error || 'error no especificado');
                err.code = response.statusCode;
                next(err);
            }

        }
    }
    request(options, callback);
};

exports.contadorRequest = function (req, res, next) {
    next();
   /**
    * @TODO falta codigo
    */
}

exports.isAdmin = function (req, res, next) {
    var options = {
        url: GATEWAY_URL + TOKEN_PATH
        , headers: { 'Authorization': (req.headers.authorization || '') }
    };

    function callback(error, response, body) {
        if (error) {
            var err = new Error('Error de conexión al validador de usuario');
            err.code = 500;
            next(err);
        } else {
            var data = JSON.parse(body);
            if (response.statusCode == 200) {
                if (data.admin) {
                    next();
                } else {
                    var err = new Error('Debe ser administrador para realizar esta acción');
                    err.code = 401;
                    next(err);
                }
            } else {
                var err = new Error(data.error || 'error no especificado');
                err.code = response.statusCode;
                next(err);
            }
        }
    }
    request(options, callback);
}