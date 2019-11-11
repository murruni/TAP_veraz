
var estados = [];
estados[1] = { 'status': '1', 'status_desc': 'Situación normal' };
estados[2] = { 'status': '2', 'status_desc': 'Riesgo potencial' };
estados[3] = { 'status': '3', 'status_desc': 'Con problemas' };
estados[4] = { 'status': '4', 'status_desc': 'Alto riesgo de insolvencia' };
estados[5] = { 'status': '5', 'status_desc': 'Irrecuperable o incobrable' };
estados[6] = { 'status': '6', 'status_desc': 'Irrecuperable o incobrable por disposición técnica' };

exports.get = (req, res, next) => {
    var ret = Object.assign({ 'cuil': '65465464' }, estados[2]);
    res.status(200).send(ret);
    next();
};

exports.getBulk = (req, res, next) => {
    var retList = [
        Object.assign({ 'cuil': '65465464' }, estados[2])
        , Object.assign({ 'cuil': '77777' }, estados[3])
        , Object.assign({ 'cuil': '6546888' }, estados[1])
    ];
    res.status(200).send(retList);    
};

exports.create = (req, res, next) => {
    console.log('create');
};


exports.update = (req, res, next) => {
    console.log('update');
};