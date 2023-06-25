const Municipality = require("../models/municipality.model");
const debug = require("debug")("app:municipality-controller");

const controller = {};

controller.createMunicipality = async (req, res) => {
    try {
        const {name} = req.body;

        const newMunicipality = new Municipality({
            name: name
        });

        const savedMunicipality = await newMunicipality.save();
        if (!savedMunicipality) {
            return res.status(409).json({ error: "Municipality cannot be saved"})
        }

        return res.status(201).json({ message: "Successfully saved municipality!"});
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = controller;