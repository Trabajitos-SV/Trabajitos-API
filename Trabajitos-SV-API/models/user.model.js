const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;
const debug = require("debug")("app:user-model");

const crypto = require("crypto");

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    hashedpassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    tokens: {
        type: [String],
        default: []
    },
    image: {
        type: String,
        required: false
    },
    hidden: {
        type: Boolean,
        default: false
    },
    municipality: {
        type: Schema.Types.ObjectId,
        ref: "Municipality"
    },
    roles: {
        type: [String],
        default: []
    },
    passResetToken: {
        type: String
    },
    passwordTokenExpires: {
        type: Date
    }
}, {timestamps: true});

userSchema.methods = {
    encryptPassword: function(password) {
        if(!password) return "";

        try {
            const encryptedPassword = crypto.pbkdf2Sync(
                password,
                this.salt,
                1000, 64,
                `sha512`
            ).toString("hex");

            return encryptedPassword;

        } catch (error) {
            debug({error});
            return "";
        }
    },
    makeSalt: function() {
        return crypto.randomBytes(16).toString("hex");
    },
    comparePassword: function(password){
        return this.hashedpassword == this.encryptPassword(password);
    },
    createResetPasswordToken: function(){
        const resetToken = crypto.randomBytes(2).toString("hex");
        this.passResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        this.passwordTokenExpires = Date.now()+ (10*60*1000);

        return resetToken;
    }
}

userSchema.virtual("password")
    .set(function(password = crypto.randomBytes(16).toString()){
        if(!password) return;

        this.salt = this.makeSalt();
        this.hashedpassword = this.encryptPassword(password);
})

module.exports = Mongoose.model("User", userSchema);