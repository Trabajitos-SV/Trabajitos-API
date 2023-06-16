const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
debug = require("debug")("app:municipality.model");

const municipalitySchema = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    }
});

modelName.exports = Mongoose.model("Municipality", municipalitySchema);
