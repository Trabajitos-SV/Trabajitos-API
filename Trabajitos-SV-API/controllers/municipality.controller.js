const Municipality = require("../models/municipality.model");
const debug = require("debug")("app:municipality-controller");

const controller = {};

controller.createMunicipality = async (req, res) => {
    try {
        const { municipalities } = req.body;

        if (!municipalities) {
            return res.status(400).json({ error: "No municipalities provided." });
        }

        const savedMunicipalities = [];

        for (const municipalityName of municipalities) {
            const newMunicipality = new Municipality({
                name: municipalityName
            });

            const savedMunicipality = await newMunicipality.save();

            if (!savedMunicipality) {
                return res.status(409).json({ error: "Unexpected error. Municipality cannot be saved." });
            }

            savedMunicipalities.push(savedMunicipality);
        }

        return res.status(201).json({ message: "Successfully saved municipalities!", savedMunicipalities });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


controller.findAll = async (req, res) => {
    try {
        const municipalities = await Municipality
            .find()
            .select("name");

        if (!municipalities) {
            return res.status(404).json({ error: "Municipalities not found." });
        }
        return res.status(200).json(municipalities);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ message: "Unexpected server error." });
    }
}

module.exports = controller;