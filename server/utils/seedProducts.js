const mongoose = require('mongoose');
const Product = require('../models/Product');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const products = [
    {
        name: 'Royal Gold Bloom Ring',
        description: 'Exquisite 22K gold ring with intricate floral patterns and high-polish finish. A masterpiece of traditional craftsmanship.',
        price: 85000,
        weight: 8.5,
        purity: '22K',
        category: 'Rings',
        type: 'Gold',
        images: ['/uploads/gold_ring.png'],
        stock: 15,
        featured: true
    },
    {
        name: 'Silver Cuban Link Chain',
        description: 'Premium .925 sterling silver Cuban link chain. Durable, stylish, and perfect for daily wear.',
        price: 12000,
        weight: 45,
        purity: '925 Silver',
        category: 'Chains',
        type: 'Silver',
        images: ['/uploads/silver_chain.png'],
        stock: 30,
        featured: true
    },
    {
        name: 'Regal Teardrop Diamond Necklace',
        description: 'Stunning teardrop diamond pendant on a 14K white gold chain. The epitome of elegance and luxury.',
        price: 240000,
        weight: 12,
        purity: '14K White Gold',
        category: 'Necklaces',
        type: 'Diamond',
        images: ['/uploads/diamond_necklace.png'],
        stock: 5,
        featured: true
    },
    {
        name: 'Modern Gold Bangle',
        description: 'Minimalist 24K gold bangle with a contemporary matte finish. Designed for the modern woman.',
        price: 110000,
        weight: 15,
        purity: '24K',
        category: 'Bracelets',
        type: 'Gold',
        images: ['/uploads/gold_bracelet.png'],
        stock: 10,
        featured: false
    },
    {
        name: 'Classic Brilliant Cut Studs',
        description: 'Classic diamond stud earrings with brilliant-cut diamonds in a platinum setting.',
        price: 180000,
        weight: 2,
        purity: 'Platinum',
        category: 'Earrings',
        type: 'Diamond',
        images: ['/uploads/diamond_earrings.png'],
        stock: 8,
        featured: true
    },
    {
        name: 'Heavy Ornate Gold Chain',
        description: 'Majestic 22K gold chain with hand-carved ornate links. A symbol of status and heritage.',
        price: 320000,
        weight: 65,
        purity: '22K',
        category: 'Chains',
        type: 'Gold',
        images: ['/uploads/gold_chain.png'],
        stock: 3,
        featured: true
    },
    {
        name: 'Rose Gold Eternity Band',
        description: 'A continuous circle of brilliance, featuring pavé-set diamonds in a 18K rose gold band.',
        price: 95000,
        weight: 4.2,
        purity: '18K Rose Gold',
        category: 'Rings',
        type: 'Diamond',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'],
        stock: 12,
        featured: true
    },
    {
        name: 'Emerald Cut Sapphire Ring',
        description: 'Deep blue emerald-cut sapphire flanked by baguette diamonds in a sleek platinum setting.',
        price: 450000,
        weight: 6.8,
        purity: 'Platinum',
        category: 'Rings',
        type: 'Diamond',
        images: ['https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?q=80&w=800'],
        stock: 2,
        featured: true
    },
    {
        name: 'Vintage Gold Locket',
        description: 'An antique-style 22K gold locket featuring hand-engraved filigree work. A timeless heirloom.',
        price: 65000,
        weight: 12.5,
        purity: '22K',
        category: 'Necklaces',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800'],
        stock: 7,
        featured: false
    },
    {
        name: 'White Gold Tennis Bracelet',
        description: 'A classic line of brilliant diamonds set in 14K white gold. The ultimate statement of luxury.',
        price: 380000,
        weight: 18,
        purity: '14K White Gold',
        category: 'Bracelets',
        type: 'Diamond',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800'],
        stock: 4,
        featured: true
    },
    {
        name: 'Hammered Silver Cuff',
        description: 'Bold .925 sterling silver cuff with a unique hammered texture. Hand-forged for a rustic yet refined look.',
        price: 18000,
        weight: 35,
        purity: '925 Silver',
        category: 'Bracelets',
        type: 'Silver',
        images: ['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=800'],
        stock: 25,
        featured: false
    },
    {
        name: 'Pearl Drop Earrings',
        description: 'Elegant South Sea pearls suspended from a delicate 18K yellow gold diamond-accented setting.',
        price: 125000,
        weight: 5.5,
        purity: '18K',
        category: 'Earrings',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800'],
        stock: 9,
        featured: true
    },
    {
        name: 'Geometric Gold Studs',
        description: 'Chic 14K yellow gold hexagonal studs with a brushed finish. Perfect for sophisticated daily wear.',
        price: 22000,
        weight: 3.8,
        purity: '14K',
        category: 'Earrings',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1635767793021-952079b58ecd?q=80&w=800'],
        stock: 20,
        featured: false
    },
    {
        name: 'Ruby Floral Pendant',
        description: 'Vibrant ruby center surrounded by diamond petals, set in 18K yellow gold.',
        price: 155000,
        weight: 8.2,
        purity: '18K',
        category: 'Necklaces',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800'],
        stock: 6,
        featured: true
    },
    {
        name: 'Matte Platinum Band',
        description: 'Sophisticated 6mm platinum band with a matte finish and polished bevel edges. A modern classic.',
        price: 88000,
        weight: 14.5,
        purity: 'Platinum',
        category: 'Rings',
        type: 'Platinum',
        images: ['https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=800'],
        stock: 15,
        featured: false
    },
    {
        name: 'Twisted Gold Rope Chain',
        description: 'Classic 22K gold rope chain with a diamond-cut finish for extra sparkle. Available in 22 inches.',
        price: 210000,
        weight: 42,
        purity: '22K',
        category: 'Chains',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1610664921890-ebad05086414?q=80&w=800'],
        stock: 11,
        featured: true
    },
    {
        name: 'Infinity Knot Bracelet',
        description: 'Delicate 14K rose gold bracelet featuring an infinity knot symbol. Represents eternal love.',
        price: 45000,
        weight: 6.2,
        purity: '14K Rose Gold',
        category: 'Bracelets',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800'],
        stock: 18,
        featured: false
    },
    {
        name: 'Solitaire Diamond Engagement Ring',
        description: 'A breathtaking 1-carat round brilliant diamond set in a classic six-prong platinum setting.',
        price: 650000,
        weight: 5.5,
        purity: 'Platinum',
        category: 'Rings',
        type: 'Diamond',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'],
        stock: 3,
        featured: true
    },
    {
        name: 'Onyx Signet Ring',
        description: 'Bold 18K yellow gold signet ring with a polished black onyx inlay. A symbol of strength.',
        price: 135000,
        weight: 18.2,
        purity: '18K',
        category: 'Rings',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1610664921890-ebad05086414?q=80&w=800'],
        stock: 5,
        featured: true
    },
    {
        name: 'Snake Link Silver Bracelet',
        description: 'Fluid .925 sterling silver snake link bracelet with a sleek high-polish finish.',
        price: 14500,
        weight: 22.5,
        purity: '925 Silver',
        category: 'Bracelets',
        type: 'Silver',
        images: ['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=800'],
        stock: 30,
        featured: false
    },
    {
        name: 'Chandelier Diamond Earrings',
        description: 'Dazzling chandelier earrings featuring over 3 carats of mixed-cut diamonds in 18K white gold.',
        price: 980000,
        weight: 12.8,
        purity: '18K White Gold',
        category: 'Earrings',
        type: 'Diamond',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800'],
        stock: 2,
        featured: true
    },
    {
        name: 'Gold Herringbone Chain',
        description: 'Elegant 14K gold herringbone chain. Sits flat on the neckline for a smooth, liquid-gold appearance.',
        price: 175000,
        weight: 28.5,
        purity: '14K',
        category: 'Chains',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800'],
        stock: 8,
        featured: true
    },
    {
        name: 'Art Deco Silver Necklace',
        description: 'Intricate .925 sterling silver necklace inspired by the Art Deco era, featuring geometric motifs.',
        price: 32000,
        weight: 48,
        purity: '925 Silver',
        category: 'Necklaces',
        type: 'Silver',
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800'],
        stock: 14,
        featured: false
    },
    {
        name: 'Interlocking Gold Circles',
        description: 'Contemporary necklace featuring two interlocking 18K gold circles. Symbolizes unity and strength.',
        price: 52000,
        weight: 9.8,
        purity: '18K',
        category: 'Necklaces',
        type: 'Gold',
        images: ['https://images.unsplash.com/photo-1610664921890-ebad05086414?q=80&w=800'],
        stock: 22,
        featured: true
    },
    {
        name: 'Platinum Marquise Ring',
        description: 'Exquisite marquise-cut diamond set in a split-shank platinum band with micropavé accents.',
        price: 540000,
        weight: 6.2,
        purity: 'Platinum',
        category: 'Rings',
        type: 'Diamond',
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800'],
        stock: 4,
        featured: true
    }
];

const seedProducts = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        if (!uri || uri.includes('localhost')) {
             console.log('Using default local MongoDB URI');
             uri = 'mongodb://localhost:27017/viva-gold';
        }
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing products (optional, but good for fresh seed)
        await Product.deleteMany({});
        console.log('🗑️ Existing products cleared');

        await Product.insertMany(products);
        console.log('✨ Products seeded successfully');

        process.exit();
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

if (require.main === module) {
    seedProducts();
}

module.exports = { seedData: products, seedProducts };
