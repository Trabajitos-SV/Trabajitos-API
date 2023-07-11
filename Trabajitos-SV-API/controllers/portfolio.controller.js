const Portfolio = require("../models/portfolio.model");
const cloudinary = require('cloudinary');
const fs = require('fs-extra');
const debug = require("debug")("app:portfolio-controller");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const controller = {};
const paginateOptions = {
    page: 1,
    limit: 10,
    populate: {
        path: 'user category',
        select: 'name phone email municipality'
    }
}

controller.create = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const portPhotos = req.files;
        const { _id: userId } = req.user;
        const uploadedImages = [];

        const healthCheck = await Portfolio.findOne({ user: userId });
        if (healthCheck) {
            return res.status(409).json({ error: "Unexpected error occurred, you already have a portfolio." });
        }

        for (const portPhoto of portPhotos) {
            try {
              const result = await cloudinary.v2.uploader.upload(portPhoto.path);
              uploadedImages.push({
                secureUrl: result.secure_url,
                publicId: result.public_id
              });
              await fs.unlink(portPhoto.path);
            } catch (error) {
              console.error('Error al subir la imagen a Cloudinary:', error);
            }
        }

        const portfolio = new Portfolio({
            title: title,
            description: description,
            uploadedImages: uploadedImages,
            user: userId,
            category: category
        });

        const newPortfolio = await portfolio.save();

        if (!newPortfolio) {
            return res.status(409).json({ error: "Unexpected error occurred, portfolio cannot be created." });
        }

        return res.status(201).json(newPortfolio);

    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
}

controller.findMyPortfolio = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const portfolio = await Portfolio.findOne({ user: userId }).populate(
            "user category",
            "name email phone municipality -_id"
        );

        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found." })
        }
        return res.status(200).json(portfolio);

    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
}

controller.findPortfolioById = async (req, res) => {
    try {
        const { identifier } = req.params;
        const portfolio = await Portfolio.findOne({ _id: identifier }).populate(
            "user category",
            "name email phone municipality -_id"
        );

        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found." });
        }

        return res.status(200).json(portfolio);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
}

controller.updatePortfolio = async (req, res) => {
    try {
        const { title, description, image, category } = req.body;
        const { identifier } = req.params;

        const updatedFields = {};

        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (image) updatedFields.image = image;
        if (category) updatedFields.category = category;

        const newUpdatePortfolio = await Portfolio.findByIdAndUpdate(
            identifier,
            updatedFields,
            {
                new: true
            }
        );

        if (!newUpdatePortfolio) {
            return res.status(409).json({ error: "Portfolio cannot be updated." })
        }

        return res.status(200).json(newUpdatePortfolio);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
}


controller.findPortfolioByCategory = async (req, res) => {
    try {
        const { identifier } = req.params;
        const { _id } = req.user;

        const portfolio = await Portfolio.paginate({
            category: identifier,
            user: { $ne: _id },
        }, paginateOptions);

        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found." });
        }

        return res.status(200).json(portfolio);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
}


controller.findAll = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().populate(
            "user category", "name phone");

        if (!portfolios) {
            return res.status(404).json({ error: "No portfolios were found." });
        }

        return res.status(200).json(portfolios);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
}


controller.createReview = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { review, portfolioId, qualification } = req.body;

        const portfolio = await Portfolio.findOne({ _id: portfolioId });

        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found." });
        }

        const newReview = {
            id_user: userId,
            description: review,
            qualification: qualification
        }

        portfolio.reviews.push(newReview);

        const totalReviews = portfolio.reviews.length;

        if (totalReviews !== 0) {
            // Calcular el promedio de las calificaciones
            const sumQualifications = portfolio.reviews.reduce(
                (total, review) => total + review.qualification,
                0
            );

            const avgQualification = sumQualifications / totalReviews;
            portfolio.avgQualification = avgQualification;
        }

        const newPortfolio = await portfolio.save();

        if (!newPortfolio) {
            return res.status(409).json({ error: "Unexpected error while creating review." });
        }

        return res.status(201).json(newPortfolio);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
}

controller.getTopPortfolios = async (req, res) => {
    try {
        const topPortfolios = await Portfolio.find({})
            .sort({ avgQualification: -1 })
            .limit(5);

        if (!topPortfolios) {
            return res.status(404).json({ message: "No top performers were found." });
        }

        return res.status(200).json(topPortfolios);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
};

controller.getRandomPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.aggregate([{ $sample: { size: 5 } }]);

        if(!portfolios){
            return res.status(404).json({ message: "No suggested portfolios were found."});
        }
        
        return res.status(200).json(portfolios);
    } catch (error) {
        debug({ error });
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = controller;