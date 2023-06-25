const User = require("../models/user.model");
const debug = require("debug")("app:auth-controller");
const ROLES = require("../data/roles.constants.json");
const crypto = require("crypto");
const sendEmail = require("../utils/email.tools");

const { createToken, verifyToken } = require("../utils/jwt.tools");

const controller = {};

controller.register = async (req, res) => {
    try {
        const { name, phone, email, password, municipality } = req.body;

        const user = await User.findOne({ email: email });

        if (user) {
            return res.status(409).json({ error: "The user in question already exists." })
        }

        const newUser = new User({
            name: name,
            phone: phone,
            email: email,
            password: password,
            municipality: municipality,
            roles: [ROLES.USER]
        })

        await newUser.save();
        return res.status(201).json({ message: "Successfully saved user!" });
    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}


controller.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const user = await User.findOne({ email: identifier });

        if (!user) {
            return res.status(404).json({ error: "The user requested doesn't exist."});
        }

        if (!user.comparePassword(password)) {
            return res.status(401).json({ error: "Invalid password!" })
        }

        const token = createToken(user._id);

        user.tokens = [token, ...user.tokens.filter(_token => verifyToken(_token)).splice(0,4)];
        await user.save();

        return res.status(200).json({ token: token });
    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}


controller.whoamI = async (req, res) => {
    try {
        const { _id, username, email, roles } = req.user;
        return res.status(200).json({ _id, username, email, roles });
    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}

controller.findAll = async (req, res) => {
    try {
        const usuarios = await User
            .find()
            .populate("municipality")

        return res.status(200).json( usuarios );
    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}


controller.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: "Cannot find a user with the given email."});
        }

        const resetToken = user.createResetPasswordToken();

        await user.save();

        const message = `We have received a password reset request. Please use the code below to reset your password inside the app\n\n${resetToken}\n\nPlease keep in mind this link will be valid just for 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password change request",
                message: message
            });

            return res.status(200).json({ msg: "Email successfully sent, please check your email inbox."});

        } catch (error) {
            user.passResetToken = undefined;
            user.passwordTokenExpires = undefined;
            user.save();
            return res.status(500).json({ error: "Unexpected error while sending reset password email. Please try again later."})
        }
    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}


controller.verifyCode = async (req, res) => {
    try {
        const token = crypto.createHash("sha256").update(req.params.code).digest("hex");
        const user = await User.findOne({ passResetToken: token, passwordTokenExpires: { $gt: Date.now()} });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token!"});
        }
        return res.status(200).json(user._id);

    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}


controller.passwordReset = async (req, res) => {
    try {
        const { identifier: userId, password } = req.body;
        const user = await User.findById({ _id: userId });

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        user.password = password;
        user.passResetToken = undefined;
        user.passwordTokenExpires = undefined;

        await user.save();

        return res.status(200).json({ message: "Information was updated!" });

    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}

module.exports = controller;