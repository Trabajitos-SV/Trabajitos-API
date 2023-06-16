const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;



const categorySchema = new Schema ({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    image:{
        type: String,
        trim: true,
    }
})



module.exports = Mongoose.model("Category", categorySchema);