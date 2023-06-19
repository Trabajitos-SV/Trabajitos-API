const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const municipalitySchema = new Schema({
    name:{
        type: String,
        trim: true,
        required: true
    }
});

module.exports = Mongoose.model("Municipality", municipalitySchema);
