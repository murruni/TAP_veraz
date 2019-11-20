const Veraz = require('../models/veraz');
const ErrorHandler = require('../utils/error');

exports.get = (req, res, next) => {
    let cuil = req.params.cuil;
    if (!cuil) return next(new ErrorHandler(400, 'Faltan parametros. Cuil es necesario.'));
    var v = new Veraz();
    v.cuil = parseInt(cuil);

    var errorCuil = v.validaFormatoCuil();
    if (errorCuil) return next(new ErrorHandler(400, errorCuil));

    Veraz.findOne({ 'cuil': v.cuil }, '-_id cuil status', function (err, data) {
        if (err) {
            if (err.name == 'CastError' && err.kind == 'ObjectId')
                return next(new ErrorHandler(503, 'Servicio de base de datos no disponible'));
            return next(err);
        }
        if (data)
            return res.status(200).send(data);
        return res.status(200).send({ cuil: v.cuil, error: 'Cuil no encontrado' });
    });
};

exports.getBulk = (req, res, next) => {
    cuils = req.body.cuils;
    if (!cuils || !cuils instanceof Array)
        return next(new ErrorHandler(400, "Falta la lista de cuils. Ejemplo { 'cuils' : [20236546548,23203213214] } "));

    Veraz.find({ 'cuil': { $in: cuils } }, '-_id cuil status', { sort: { cuil: 1 } }, function (err, data) {
        if (err) {
            if (err.name == 'CastError' && err.kind == 'ObjectId')
                return next(new ErrorHandler(503, 'Servicio de base de datos no disponible'));
            return next(err);
        }

        let dataCuils = data.map(d => d.cuil);
        let noCuils = cuils.filter(el => !dataCuils.includes(el));
        noCuils.forEach(c => data.push({ 'cuil': c, 'error': 'Cuil no encontrado' }));
        return res.status(200).send(data);
    });
};

exports.create = (req, res, next) => {
    var v = new Veraz();
    v.cuil = parseInt(req.body.cuil);
    v.status = parseInt(req.body.status);

    if (!v.cuil || !v.status) return next(new ErrorHandler(400, 'Faltan parametros. Cuil y status son necesarios.'));

    var errorCuil = v.validaFormatoCuil();
    if (errorCuil) return next(new ErrorHandler(400, errorCuil));

    v.save(function (err) {
        if (err) {
            if (err.name == 'CastError' && err.kind == 'ObjectId')
                return next(new ErrorHandler(503, 'Servicio de base de datos no disponible'));
            return next(new ErrorHandler(400, err.errors.cuil.message));
        }
        res.status(200).send(v.formatoSalida());
    });

};

exports.update = (req, res, next) => {
    var v = new Veraz();
    v.cuil = parseInt(req.params.cuil);
    v.status = parseInt(req.body.status);

    if (!v.cuil || !v.status) return next(new ErrorHandler(400, 'Faltan parametros. Cuil y status son necesarios.'));

    var errorCuil = v.validaFormatoCuil();
    if (errorCuil) return next(new ErrorHandler(400, errorCuil));

    Veraz.findOne({ 'cuil': v.cuil }).then(
        (vFound) => {
            vFound.status = v.status;
            vFound.save(function (err) {
                if (err) {
                    if (err.name == 'CastError' && err.kind == 'ObjectId')
                        return next(new ErrorHandler(503, 'Servicio de base de datos no disponible'));
                    return next(new ErrorHandler(400, err.errors.cuil.message));
                }
                res.status(200).send(vFound.formatoSalida());
            });
        }
    ).catch(
        function (err) { return next(err) }
    );
};