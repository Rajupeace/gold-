const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateNotification, sendAdminSaleAlert } = require('../utils/notificationService');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_viva_gold',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'viva_gold_secret'
});

exports.createOrder = async (req, res) => {
    // Destructure at the top to ensure broad scope
    const { items, totalAmount, shippingAddress, paymentStatus, paymentMethod, isGift, giftMessage } = req.body;
    let userId = req.user?.id;
    let formattedItems = [];

    try {
        console.log('Order creation request received:', req.body);
        console.log('User from request:', req.user);

        // If user not in request (demo mode), extract from token
        if (!userId) {
            try {
                const jwt = require('jsonwebtoken');
                const token = req.headers.authorization?.split(' ')[1];
                if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userId = decoded.id;
                    console.log('User ID from token:', userId);
                }
            } catch (err) {
                console.error('Token verification failed:', err);
            }
        }

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Format items to match new schema
        formattedItems = items.map(item => ({
            product: item._id || item.product,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            images: item.images || []
        }));

        console.log('Formatted items:', formattedItems);

        // Handle Razorpay Payment
        if (paymentMethod === 'razorpay') {
            const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
            const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

            // Check if we should use Demo Mode (if keys are missing or are placeholders)
            const isDemoMode = !RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === 'rzp_test_viva_gold';

            if (isDemoMode) {
                console.log('⚠️ Razorpay keys missing. Using Demo Mode for checkout.');
                const order = new Order({
                    user: userId,
                    items: formattedItems,
                    totalAmount,
                    shippingAddress,
                    paymentMethod: 'razorpay',
                    isGift,
                    giftMessage,
                    razorpayOrderId: `demo_order_${Date.now()}`,
                    paymentStatus: 'pending'
                });

                const createdOrder = await order.save();
                
                return res.status(201).json({
                    order: createdOrder,
                    razorpayOrderId: createdOrder.razorpayOrderId,
                    amount: Math.round(totalAmount * 100),
                    currency: "INR",
                    key_id: 'rzp_test_demo', // Placeholder
                    isDemo: true
                });
            }

            const options = {
                amount: Math.round(totalAmount * 100),
                currency: "INR",
                receipt: `receipt_order_${Date.now()}`,
            };

            const razorpayOrder = await razorpay.orders.create(options);
            console.log('Razorpay Order Created:', razorpayOrder);

            const order = new Order({
                user: userId,
                items: formattedItems,
                totalAmount,
                shippingAddress,
                paymentMethod: 'razorpay',
                isGift,
                giftMessage,
                razorpayOrderId: razorpayOrder.id,
                paymentStatus: 'pending'
            });

            const createdOrder = await order.save();
            
            return res.status(201).json({
                order: createdOrder,
                razorpayOrderId: razorpayOrder.id,
                amount: options.amount,
                currency: options.currency,
                key_id: RAZORPAY_KEY_ID
            });
        }
    } catch (error) {
        console.error('Order creation error (Razorpay Phase):', error);
        
        // If Razorpay fails but it wasn't a demo mode attempt, return 401/500
        if (error.statusCode === 401 || (error.error && error.error.description === 'Authentication failed')) {
            return res.status(401).json({ 
                message: 'Razorpay authentication failed. Please check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the .env file.',
                error: error.error
            });
        }
        
        return res.status(500).json({ message: error.message });
    }

    try {
        // Handle other payment methods (Demo/Manual UPI/COD)
        const isCOD = paymentMethod === 'cod';
        
        const order = new Order({
            user: userId,
            items: formattedItems,
            totalAmount,
            shippingAddress,
            isGift,
            giftMessage,
            paymentMethod: paymentMethod || 'upi',
            razorpayOrderId: null,
            paymentStatus: isCOD ? 'pending' : 'paid' // COD starts as pending, manual/demo UPI as paid
        });

        console.log('Order object created:', order);
        const createdOrder = await order.save();
        console.log('Order saved successfully:', createdOrder);

        // Trigger notifications
        try {
            await sendOrderConfirmationEmail(createdOrder, req.user);
            await sendAdminSaleAlert(createdOrder, req.user);
        } catch (err) {
            console.error('Notification error:', err);
        }

        res.status(201).json({
            order: createdOrder,
            demoMode: true,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Order creation error (Manual Phase):', error);
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
        
        // Handle Demo Verification
        if (razorpayOrderId && razorpayOrderId.startsWith('demo_order_')) {
            const order = await Order.findOne({ razorpayOrderId }).populate('user', 'name email');
            if (order) {
                order.paymentStatus = 'paid';
                order.razorpayPaymentId = 'demo_payment_' + Date.now();
                await order.save();
                
                await sendOrderConfirmationEmail(order, order.user);
                await sendAdminSaleAlert(order, order.user);
                
                return res.json({ message: "Demo Payment verified successfully!", order });
            }
            return res.status(404).json({ message: "Order not found" });
        }

        const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
        if (!RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay Secret not configured on server" });
        }

        const shasum = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const digest = shasum.digest("hex");

        if (digest === razorpaySignature) {
            const order = await Order.findOne({ razorpayOrderId }).populate('user', 'name email');
            if (order) {
                order.paymentStatus = 'paid';
                order.razorpayPaymentId = razorpayPaymentId;
                await order.save();
                
                // Send confirmation notification
                await sendOrderConfirmationEmail(order, order.user);
                
                // Alert admin of new sale amount
                await sendAdminSaleAlert(order, order.user);
                
                res.json({ message: "Payment verified successfully! Notification sent.", order });
            } else {
                res.status(404).json({ message: "Order not found" });
            }
        } else {
            res.status(400).json({ message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) {
            order.orderStatus = req.body.orderStatus || order.orderStatus;
            order.trackingId = req.body.trackingId || order.trackingId;
            const updatedOrder = await order.save();
            
            // Send status update notification
            await sendOrderStatusUpdateNotification(updatedOrder, updatedOrder.user);
            
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const User = require('../models/User');
        const Product = require('../models/Product');
        
        const totalRevenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const activeProductsResult = await Product.countDocuments();
        
        // Low Stock Products
        const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).limit(5);

        const recentOrders = await Order.find()
            .populate('user', 'name')
            .populate({
                path: 'items.product',
                select: 'name images'
            })
            .sort({ createdAt: -1 })
            .limit(10);

        // Map recent orders to include the first item's image for the dashboard table
        const formattedOrders = recentOrders.map(order => {
            const orderObj = order.toObject();
            // Fallback for demo products that might not be fully populated in the DB yet
            if (orderObj.items && orderObj.items.length > 0) {
                orderObj.items = orderObj.items.map(item => ({
                    ...item,
                    name: item.name || (item.product ? item.product.name : 'Jewelry Item'),
                    images: item.images || (item.product ? item.product.images : [])
                }));
            }
            return orderObj;
        });

        // Weekly revenue (simplified for demo)
        const weeklyRevenue = [
            { name: 'Mon', revenue: 4000 },
            { name: 'Tue', revenue: 3000 },
            { name: 'Wed', revenue: 5000 },
            { name: 'Thu', revenue: 2780 },
            { name: 'Fri', revenue: 6890 },
            { name: 'Sat', revenue: 8390 },
            { name: 'Sun', revenue: 9490 },
        ];

        res.json({
            stats: {
                totalRevenue: totalRevenueResult[0]?.total || 0,
                totalOrders,
                totalUsers,
                activeProducts: activeProductsResult,
                lowStockProducts
            },
            recentOrders: formattedOrders,
            weeklyRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
