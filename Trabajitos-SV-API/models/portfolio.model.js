const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const portfolioSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        trim: true,
        required: true
    },
    images:{
        type: [String],
        default: []
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    reviews: [{
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
        }]
});

portfolioSchema.plugin(mongoosePaginate);
module.exports = Mongoose.model("Portfolio", portfolioSchema);