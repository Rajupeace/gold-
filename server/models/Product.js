const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true }, // in grams
    purity: { type: String, required: true }, // e.g., 22K, 24K, 18K
    category: { type: String, required: true }, // Rings, Necklaces, etc.
    type: { type: String, required: true, default: 'Gold' }, // Gold, Silver, Diamond, etc.
    images: [{ type: String }], // URLs to images
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
