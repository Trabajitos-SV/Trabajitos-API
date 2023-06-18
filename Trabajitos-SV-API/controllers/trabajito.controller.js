const Trabajito = require("../models/trabajito.model");
const debug = require("debug")("app:trabajito-controller");


const controller = {};


controller.createTrabajito = async() => {
    try {
        const { description, dateInit, status, id_hired } = req.body;
        const { _id: userId } = req.user;

        const trabajito = new Trabajito({
            description: description,
            dateInit: dateInit,
            status: status,
            id_solicitor: userId,
            id_hired: id_hired
        });

        const newTrabajito = await trabajito.save();

        if(!newTrabajito){
            return res.status(409).json({ error: "Unexpected error creating a review" });
        }

        return res.status(201).json(newTrabajito);

    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: " Internal server error" });

    }
}






module.exports = controller;