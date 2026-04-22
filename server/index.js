const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin Seeding
const seedAdmin = async () => {
    try {
        const User = require('./models/User');
        console.log('💎 Synchronizing Admin Credentials...');
        console.log('Admin Email from env:', process.env.ADMIN_EMAIL);
        console.log('Admin Password from env:', process.env.ADMIN_PASSWORD);
        
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('Creating new admin user...');
            admin = new User({
                name: 'Evergreen Elegance Admin',
                email: process.env.ADMIN_EMAIL || 'admin@viva-gold.com',
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                role: 'admin'
            });
        } else {
            console.log('Updating existing admin user...');
            admin.name = 'Evergreen Elegance Admin';
            admin.email = process.env.ADMIN_EMAIL || 'admin@viva-gold.com';
            admin.password = process.env.ADMIN_PASSWORD || 'Admin@123';
        }
        await admin.save();
        console.log('✅ Admin Synchronized');
        console.log('Admin Email:', admin.email);
        console.log('Admin ID:', admin._id);

        const Product = require('./models/Product');
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('💎 Seeding Premium Jewelry Collection...');
            const { seedData } = require('./utils/seedProducts');
            await Product.insertMany(seedData);
            console.log('✅ Collection Seeded');
        }
    } catch (err) {
        console.error('❌ Seeding Error:', err);
    }
};

// MongoDB Connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ MONGODB_URI is missing! Please set it in Vercel environment variables.');
            return;
        }
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected');
        await seedAdmin();
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
    res.send('Evergreen Elegance Jewelry API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
