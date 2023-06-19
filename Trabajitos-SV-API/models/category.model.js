const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

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


categorySchema.plugin(mongoosePaginate);
module.exports = Mongoose.model("Category", categorySchema);