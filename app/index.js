const PORT = process.env.PORT || 3003;
const MONGO_URL = process.env.MONGO_URL || 'clustermongodb-1sv33.mongodb.net';
const MONGO_DB = process.env.MONGO_DB || 'up_tap';
const MONGO_USR = process.env.MONGO_USR || 'up_tap_veraz';
const MONGO_PASS = process.env.MONGO_PASS || 'QoNCPCuTYSp3uAjC';

// configuracion express de la app
var app = require('./app');

// base de datos
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Usamos el método connect para conectarnos a nuestra base de datos
mongoose.connect(`mongodb+srv://${MONGO_USR}:${MONGO_PASS}@${MONGO_URL}/${MONGO_DB}?retryWrites=true&w=majority`
    , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("La conexión a la base de datos se ha realizado correctamente")
        app.listen(PORT, () => {
            console.log(`servidor corriendo en puerto ${PORT}`);
        });
    })
    // Si no se conecta correctamente escupimos el error
    .catch(err => console.log(err));   
