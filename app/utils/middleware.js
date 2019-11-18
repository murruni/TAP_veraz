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
        if (error) return next(new ErrorHandler(500, 'Error de conexión al validador de usuarios'));
        if (response.statusCode == 200) return next();
        if (response.statusCode == 401) return next(new ErrorHandler(401, (JSON.parse(body).error || '')));
        if (response.statusCode == 503) return next(new ErrorHandler(500, 'Error de conexión al validador de usuarios'));
        return next(new ErrorHandler(500, 'Error no especificado'));
    }
    return request(options, callback);
};

exports.contadorRequest = function (req, res, next) {
    var cantReq = req.body.cuils.length;
    if (cantReq <= 0) return next();

    var options = {
        url: GATEWAY_URL + COUNTER_PATH + '/' + cantReq
        , headers: { 'Authorization': (req.headers.authorization || '') }
    };

    function callback(error, response, body) {
        if (error) return next(new ErrorHandler(500, 'Error de conexión al contador de request'));
        if (response.statusCode == 200) return next();
        if (response.statusCode == 400) return next(new ErrorHandler(400, JSON.parse(body).error));
        if (response.statusCode == 401) return next(new ErrorHandler(401, (JSON.parse(body).error || '')));
        return next(new ErrorHandler(500, 'Error no especificado'));
    }

    return request(options, callback);
}

exports.isAdmin = function (req, res, next) {
    var options = {
        url: GATEWAY_URL + TOKEN_PATH
        , headers: { 'Authorization': (req.headers.authorization || '') }
    };

    function callback(error, response, body) {
        if (error) return next(new ErrorHandler(500, 'Error de conexión al validador de usuario'));
        if (response.statusCode == 503) return next(new ErrorHandler(500, 'Error de conexión al validador de usuarios'));
        if (response.statusCode == 401) return next(new ErrorHandler(401, (JSON.parse(body).error || '')));
        if (response.statusCode == 200) {
            if (JSON.parse(body).admin) return next();
            else return next(new ErrorHandler(500, 'Debe ser administrador para realizar esta acción'));
        }
        return next(new ErrorHandler(500, 'Error no especificado'));
    }
    return request(options, callback);
}

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}