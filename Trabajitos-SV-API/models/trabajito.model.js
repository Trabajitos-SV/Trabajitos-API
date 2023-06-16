const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;


const trabajitosSchema = new Schema({
    desciptiion:{
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
        default: true
    },
    status:{
        type: Schema.Types.ObjectId,
        ref: "Status",
        required: true
    }
});



module.exports = Mongoose.model("Trabajitos", trabajitosSchema);