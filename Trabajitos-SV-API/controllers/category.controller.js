const Category = require("../models/category.model");
const debug = require("debug")("app:category-controller");

const controller = {};
const options = {
    page: 1,
    limit: 10,
    select: "name image"
}

controller.createCategory = async (req, res) => {
    try {
        const {name, image} = req.body;

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

controller.createCategory = async (req, res) => {
    try {
        const { categories } = req.body;

        if (!categories) {
            return res.status(400).json({ error: "No categories provided." });
        }

        const savedCategories = [];

        for (const categoryName of categories) {
            const newCategory = new Category({
                name: categoryName
            });

            const savedCategory = await newCategory.save();

            if (!savedCategory) {
                return res.status(409).json({ error: "Unexpected error. Category cannot be saved." });
            }

            savedCategories.push(savedCategory);
        }

        return res.status(201).json({ message: "Successfully saved categories!", savedCategories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

controller.findAllCategories = async(req, res) => {
    try {
        const category = await Category.paginate({}, options);

        if(!category)
            return res.status(404).json({ message: "Categories not found."});
        return res.status(200).json({ category });

    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error."});
    }
};

module.exports = controller;