const Review = require('../models/review.model.js');
const debug = require('debug')('app:review-controller');

const controller = {};

controller.createReview = async(req, res) => {
    try {
        const { description, qualification, portfolio } = req.body;

        const { _id: userId } = req.user;

        const review = new Review ({
            description: description,
            qualification: qualification,
            id_user: userId,
            id_portfolio: portfolio
        });

        const newReview = await review.save();

        if (!newReview){
            return res.status(409).json({ error: "Unexpected error creating a review" });
        }

        return res.status(201).json(newReview);

    } catch(error) {
        debug({ error })
        return res.status(500).json({ error: "Internal server error" })
    } 
};