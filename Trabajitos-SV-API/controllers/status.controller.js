const Status = require("../models/status.model");
const debug = require("debug")("app:status-controller");


const controller = {};

controller.createStatus = async (req, res) => {
    try {
        const { name } = req.body;

        const newStatus = new Status({
            name: name
        });

        await newStatus.save();

        return res.status(201).json({ message: "Status saved successfully!"});

    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Internal server error"});
    }
};

module.exports = controller; 
