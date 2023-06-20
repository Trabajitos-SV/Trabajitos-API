const Trabajito = require("../models/trabajito.model");
const debug = require("debug")("app:trabajito-controller");

const controller = {};

const requestOptions = {
    page: 1,
    limit: 10,
    populate: {
        path: 'id_hired status',
        select: 'name phone email'
    }
}

const jobOptions = {
    page: 1,
    limit: 10,
    populate: {
        path: 'id_solicitor status',
        select: 'name phone email'
    }
}

controller.createTrabajito = async () => {
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

        if (!newTrabajito) {
            return res.status(409).json({ error: "Unexpected error creating a job request" });
        }

        return res.status(201).json(newTrabajito);

    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: " Internal server error" });
    }
}

controller.startTrabajito = async (req, res) => {
    try {
        const { id: trabajitoId, dateFinish, status } = req.body;
        const { _id: userId } = req.user;

        const trabajito = await Trabajito.findOne({ _id: trabajitoId, id_hired: userId });

        if (!trabajito) {
            return res.status(404).json({ error: "Job not found! " });
        }

        trabajito.dateFinish = dateFinish;
        trabajito.status = status;

        const updatedTrabajito = await trabajito.save();
        if (!updatedTrabajito) {
            return res.status(409).json({ error: "Unexpected error updating a job" });
        }

        return res.status(200).json(updatedTrabajito);
    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: " Internal server error" });
    }
}

constroller.endTrabajito = async (req, res) => {
    try {
        const { id: trabajitoId, endNumber } = req.body;
        const { _id: userId } = req.user;

        const trabajito = await Trabajito.findOne({ _id: trabajitoId, id_hired: userId });

        if (!trabajito) {
            return res.status(404).json({ error: "Trabajito not found" });
        }

        trabajito.endNumber = endNumber;

        const updatedTrabajito = await trabajito.save();
        if (!updatedTrabajito) {
            return res.status(409).json({ error: "Unexpected error updating trabajito" });
        }

        return res.status(200).json(updatedTrabajito);

    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

controller.endConfirmationTrabajito = async (req, res) => {
    try {
        const { id: trabajitoId, endNumber, status } = req.body;
        const { _id: userId } = req.user;

        const trabajito = await Trabajito.findOne({ _id: trabajitoId, id_solicitor: userId });

        if (!trabajito) {
            return res.status(404).json({ error: "Trabajito not found" });
        }

        if (endNumber !== trabajito.endNumber) {
            return res.status(500).json({ error: "The confirmation number is not valid" });
        }

        trabajito.status = status;

        const updatedTrabajito = await trabajito.save();

        if (!updatedTrabajito) {
            return res.status(409).json({ error: "Unexpected error updating trabajito" });
        }

        return res.status(200).json(updatedTrabajito);

    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

controller.findAll = async (req, res) => {
    try {
        const trabajitos =
            await Trabajito
                .find()
                .populate("id_solicitor status", "name phone email")
                .populate("id_hired", "name phone email");

        if (!trabajitos) {
            return res.status(404).json({ error: "Trabajito not found " })
        }

        return res.status(200).json({ trabajitos });

    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

controller.findMyRequests = async (req, res) => {
    try {
        const { _id: userId } = req.user;

        const trabajitos =
            await Trabajito
                .paginate({ id_solicitor: userId, hidden: false }, requestOptions);

        if (!trabajitos) {
            return res.status(404).json({ error: "Requests not found" })
        }

        return res.status(200).json(trabajitos);

    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

controller.findRequestById = async (req, res) => {
    try {
        const { identifier } = req.params;
        const { _id: userId } = req.user;

        const trabajito =
            await Trabajito
                .findOne({ _id: identifier, id_solicitor: userId })
                .populate("id_hired status", "name phone email municipality");

        if (!trabajito) {
            return res.status(404).json({ error: "Trabajito not found" });
        }

        return res.status(200).json(trabajito);
    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

controller.findMyJobs = async (req, res) => {
    try {
        const { _id: userId } = req.user;

        const trabajitos =
            await Trabajito
                .paginate({ id_hired: userId }, jobOptions);

        if (!trabajitos) {
            return res.status(404).json({ error: "Trabajito not found" });
        }

        return res.status(200).json( trabajitos );
    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

controller.findJobById = async (req, res) => {
    try {
        const { identifier } = req.params;
        const { _id: userId } = req. user;

        const trabajito =
            await Trabajito
                .find({ _id: identifier, id_hired: userId})
                .populate("id_solicitor status", "name phone email municipality");

        if (!trabajito) {
            return res.status(404).json({ error: "Trabajito not found" });
        }

        return res.status(200).json( trabajito );
    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

controller.trabajitoDeletion = async (req, res) => {
    try {
        const { identifier: trabajitoId } = req.params;
        const { _id: userId } = req.user;

        const trabajito = await Trabajito.findOne({ _id: trabajitoId, id_solicitor: userId});

        if(!trabajito) {
            return res.status(404).json({ error: "Trabajito not found" });
        }

        trabajito.hidden = !trabajito.hidden;

        await trabajito.save();
        return res.status(200).json({ message: "Trabajito was successfully deleted" })
    } catch (error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = controller;