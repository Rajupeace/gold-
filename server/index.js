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



// DB Status Middleware
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1 && !req.path.startsWith('/uploads')) {
        return res.status(503).json({ 
            message: "Database not connected. Please check your MONGODB_URI in Render settings.",
            status: "DB_DISCONNECTED"
        });
    }
    next();
});

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
                name: 'Evergreen Gold Admin',
                email: process.env.ADMIN_EMAIL || 'admin@viva-gold.com',
                password: process.env.ADMIN_PASSWORD || 'Admin@123',
                role: 'admin'
            });
        } else {
            console.log('Updating existing admin user...');
            admin.name = 'Evergreen Gold Admin';
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

// MongoDB Connection with Retry Logic
const connectDB = async (retryCount = 5) => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
    
    if (!uri || uri.includes('localhost')) {
        console.warn('⚠️ WARNING: Using local/missing MongoDB URI. If this is production (Render), please set MONGODB_URI in your dashboard.');
    }

    try {
        if (!uri) {
            throw new Error('MONGODB_URI is missing');
        }
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
        });
        console.log('✅ MongoDB Connected Successfully');
        await seedAdmin();
    } catch (err) {
        console.error(`❌ MongoDB Connection Error (Attempts remaining: ${retryCount}):`, err.message);
        if (retryCount > 0) {
            console.log('🔄 Retrying in 5 seconds...');
            setTimeout(() => connectDB(retryCount - 1), 5000);
        } else {
            console.error('🛑 Max retries reached. Database remains disconnected.');
        }
    }
};

connectDB();

// Enhanced Health Check
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized'
    };
    
    res.json({ 
        status: 'OK', 
        database: states[dbState] || 'unknown',
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
    res.send('Evergreen Gold Jewelry API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For local development or non-Vercel platforms (like Render)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
