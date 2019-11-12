const myMiddlewares = require('./middlewares');
const Veraz = require('./veraz.model');

const estados = [];
estados[1] = { 'status': '1', 'status_desc': 'Situación normal' };
estados[2] = { 'status': '2', 'status_desc': 'Riesgo potencial' };
estados[3] = { 'status': '3', 'status_desc': 'Con problemas' };
estados[4] = { 'status': '4', 'status_desc': 'Alto riesgo de insolvencia' };
estados[5] = { 'status': '5', 'status_desc': 'Irrecuperable o incobrable' };
estados[6] = { 'status': '6', 'status_desc': 'Irrecuperable o incobrable por disposición técnica' };

exports.get = (req, res, next) => {
    myMiddlewares.contadorRequest(req, res, next);
    /*
    var ret = Object.assign({ 'cuil': '65465464' }, estados[2]);
    res.status(200).send(ret);
    next();
    */

    let cuil = req.params.cuil;
    /**
     * @TODO validar formato cuil
     */
    if (!cuil) {
        res.status(400).send('Missing parameters. Cuil are required.');
        return next();
    }

    Veraz.findOne({ 'cuil': cuil }, function (err, data) {
        if (err) {
            if (err.name == 'CastError' && err.kind == 'ObjectId') {
                res.status(503).send('Service Unavailable');
            }
            return next(err);
        }
        res.send(data);
    });
};

exports.getBulk = (req, res, next) => {
    // req.body.
    myMiddlewares.contadorRequest(req, res, next);
    var retList = [
        Object.assign({ 'cuil': '65465464' }, estados[2])
        , Object.assign({ 'cuil': '77777' }, estados[3])
        , Object.assign({ 'cuil': '6546888' }, estados[1])
    ];
    res.status(200).send(retList);
};

exports.create = (req, res, next) => {
    myMiddlewares.isAdmin(req, res, next);

    var v = new Veraz();
    v.cuil = req.body.cuil;
    v.status = req.body.status;

    if (!v.cuil || !v.status) {
        res.status(400).send('Missing parameters. Cuil & status are required.');
        return next();
    }
/*
    Veraz.findOne({ 'cuil': v.cuil }, function (err, data) {
        if (err) {
            if (err.name == 'CastError' && err.kind == 'ObjectId') {
                res.status(503).send('Service MongoDB Unavailable');
            }
            return next(err);
        }
        console.log(data);
    });
*/
    v.save(function (err) {
        if (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                res.status(400).send('Service MongoDB Unavailable');
            }
            return next(err);
        }
        res.send(v);
    });
};


exports.update = (req, res, next) => {
    myMiddlewares.isAdmin(req, res, next);

    console.log('update');
};