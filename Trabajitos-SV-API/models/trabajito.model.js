const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2")

const trabajitoSchema = new Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    dateInit:{
        type: Date,
        required: true
    },
    dateFinish:{
        type: Date
    },
    endNumber:{
        type: String,
        default: " "
    },
    id_solicitor:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hidden:{
        type: Boolean,
        default: false
    },
    id_hired:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: Schema.Types.ObjectId,
        ref: "Status",
        required: true
    },
    bill: [
        {
            itemCharged: String,
            cost: Number
        }
    ]
});

trabajitoSchema.plugin(mongoosePaginate);
module.exports = Mongoose.model("Trabajito", trabajitoSchema);