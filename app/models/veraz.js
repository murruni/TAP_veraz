const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let VerazSchema = new Schema({
    cuil: { type: Number, unique: true }
    , status: Number
});
VerazSchema.plugin(uniqueValidator, { message: '{PATH} ya existe en la base.' });

// Export the model
module.exports = mongoose.model('Veraz', VerazSchema);

const estados = [];
estados[1] = { 'status': '1', 'status_desc': 'Situación normal' };
estados[2] = { 'status': '2', 'status_desc': 'Riesgo potencial' };
estados[3] = { 'status': '3', 'status_desc': 'Con problemas' };
estados[4] = { 'status': '4', 'status_desc': 'Alto riesgo de insolvencia' };
estados[5] = { 'status': '5', 'status_desc': 'Irrecuperable o incobrable' };
estados[6] = { 'status': '6', 'status_desc': 'Irrecuperable o incobrable por disposición técnica' };

/**
 * Devuelve quitando/agregando solo los campos necesarios para la respuesta
 */
module.exports.prototype.formatoSalida = function () {
    var data = JSON.parse(JSON.stringify(this));
    delete data._id;
    data.status_desc = estados[data.status].status_desc;
    return data;
}


/**
 * Devuelve mensaje de error o nada
 * @param {*} cuil 
 */
module.exports.prototype.validaFormatoCuil = function () {
    var cuil = JSON.parse(JSON.stringify(this)).cuil.toString();

    if (cuil.length != 11) return 'El cuil ' + cuil + ' debe tener 11 números';

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