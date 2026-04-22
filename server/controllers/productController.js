const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category && category !== 'All') query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        let imageList = [];

        // Add uploaded files
        if (req.files && req.files.length > 0) {
            const uploadedImages = req.files.map(file => `/uploads/${file.filename}`);
            imageList = [...imageList, ...uploadedImages];
        }

        // Add string URLs from body if any
        if (req.body.images) {
            const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
            imageList = [...imageList, ...bodyImages];
        }

        productData.images = imageList;
        const product = new Product(productData);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const productData = { ...req.body };
            let imageList = [];

            // Add string URLs from body if any (existing images being kept)
            if (req.body.images) {
                const bodyImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
                imageList = [...imageList, ...bodyImages];
            }

            // Add newly uploaded files
            if (req.files && req.files.length > 0) {
                const uploadedImages = req.files.map(file => `/uploads/${file.filename}`);
                imageList = [...imageList, ...uploadedImages];
            }

            productData.images = imageList;
            Object.assign(product, productData);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user.id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: 'Product already reviewed' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user.id,
            };

            product.reviews.push(review);
            product.ratings.count = product.reviews.length;
            product.ratings.average = 
                product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
