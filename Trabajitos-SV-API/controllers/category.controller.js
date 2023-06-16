const Category = require("../models/category.model");
const debug = require("debug")("app:category-controller");

const controller = {};


controller.createCategory = async (req, res) => {
    try {
        const {name, image} = rep.body;

        const newCategory = new Category({
            name: name,
            image: image
        });

        await newCategory.save();

        return res.status(201).json({ message: "Category save successfully"});
    } catch (error){
        debug({ error });
        return res.status(500).json({ message: "Internal server error"});
    }
};