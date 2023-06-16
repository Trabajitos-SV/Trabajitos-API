const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const statusSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = Mongoose.model("Status", statusSchema);