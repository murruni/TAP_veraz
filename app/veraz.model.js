const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let VerazSchema = new Schema({
    cuil: String
    , status: String
});

// Export the model
module.exports = mongoose.model('Veraz', VerazSchema);
