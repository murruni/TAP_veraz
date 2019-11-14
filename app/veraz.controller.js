const myMiddlewares = require('./middlewares');
const Veraz = require('./veraz.model');

exports.get = (req, res, next) => {
    myMiddlewares.contadorRequest(req, res, next);

    let cuil = req.params.cuil;
    if (!cuil) return next(new ErrorHandler(400, 'Faltan parametros. Cuil es necesario.'));

    var v = new Veraz();
    v.cuil = parseInt(cuil);

    var errorCuil = v.validaFormatoCuil();
    if (errorCuil) return next(new ErrorHandler(400, errorCuil));
    try {
        Veraz.findOne({ 'cuil': v.cuil }, function (err, data) {
            if (err) {
                if (err.name == 'CastError' && err.kind == 'ObjectId') {
                    res.status(503).send('Servicio de base de datos no cdisponible');
                }
                return next(err);
            }
            res.status(200).send(data.formatoSalida());
        })
    } catch (error) {
        console.log('error')
        return next(error);

    }
};

exports.getBulk = (req, res, next) => {
    // req.body.

    myMiddlewares.contadorRequest(req, res, next);
    var retList = [
        Object.assign({ 'cuil': '65465464' })
        , Object.assign({ 'cuil': '77777' })
        , Object.assign({ 'cuil': '6546888' })
    ];
    res.status(200).send(retList);
};

exports.create = (req, res, next) => {
    myMiddlewares.isAdmin(req, res, next);

    var v = new Veraz();
    v.cuil = parseInt(req.body.cuil);
    v.status = parseInt(req.body.status);

    if (!v.cuil || !v.status) return next(new ErrorHandler(400, 'Faltan parametros. Cuil y status son necesarios.'));

    var errorCuil = v.validaFormatoCuil();
    if (errorCuil) return next(new ErrorHandler(400, errorCuil));

    v.save(function (err) {
        if (err) {
            console.log('err.errors.cuil.message: ', err.errors.cuil.message);
            //return new ErrorHandler(400, err.errors.cuil.message);
            return next(new ErrorHandler(400, err.errors.cuil.message));
        } else {
            console.log('resultado: ', v.formatoSalida());
            res.status(200).send(v.formatoSalida());
            return;
        }
    });
};

exports.update = (req, res, next) => {
    myMiddlewares.isAdmin(req, res, next);

    console.log('update');
};



/**
 * Devuelve mensaje de error o nada
 * @param {*} cuil 
 */
const validaFormatoCuil = function (cuil) {
    if (cuil.length != 11) return 'El cuil ' + cuil + ' no tiene 11 números';

    var prefijos = [20, 23, 24, 27];
    var prefijo = cuil.substr(0, 2);
    var base = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    var aux = 0;

    if (prefijos.includes(prefijo)) return prefijo + ' no es un prefijo válido';

    for (var i = 0; i < 10; i++) aux += parseInt(cuil[i]) * base[i];

    aux = 11 - aux % 11;
    aux = aux == 11 ? 0 : aux == 10 ? 9 : aux;

    if (aux != cuil[10]) return 'Error con el dígito validador (debería ser ' + aux + ')';
}

class ErrorHandler extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}