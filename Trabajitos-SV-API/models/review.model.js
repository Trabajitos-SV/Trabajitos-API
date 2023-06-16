const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const reviewSchema = new Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    qualification: {
        type: Number,
        required: true
    },
    id_user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = Mongoose.model("Review", reviewSchema);