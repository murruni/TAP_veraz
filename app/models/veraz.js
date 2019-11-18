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

/**
 * Devuelve quitando/agregando solo los campos necesarios para la respuesta
 */
module.exports.prototype.formatoSalida = function () {
    var data = JSON.parse(JSON.stringify(this));
    delete data._id;
    delete data.__v;
    return data;
}

/**
 * Devuelve mensaje de error o nada
 * @param {*} cuil 
 */
module.exports.prototype.validaFormatoCuil = function (c) {
    if (c) var cuil = c;
    else var cuil = JSON.parse(JSON.stringify(this)).cuil.toString();

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