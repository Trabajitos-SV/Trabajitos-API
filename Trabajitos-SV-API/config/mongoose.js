const Mongoose = require("mongoose");
const debug = require("debug")("app:mongoose");

const dbhost = process.env.DBHOST || "localhost";
const dbport = process.env.DBPORT || "27017";
const dbname = process.env.DBNAME || "trabajitosDB";

const dburi = process.env.DBURI || `mongodb://${dbhost}:${dbport}/${dbname}`;

const connect = async () => {
    debug(dburi);
    try {
        await Mongoose.connect(dburi);
        debug("Conexion a la base exitosa!");
    } catch (error) {
        debug("Error en la conexion a la base");
        process.exit(1);
    }
}

module.exports = {
    connect
}