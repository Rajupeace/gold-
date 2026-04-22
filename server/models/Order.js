const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        images: [String]
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    isGift: { type: Boolean, default: false },
    giftMessage: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['upi', 'razorpay', 'phonepe', 'gpay', 'paytm', 'cod'], default: 'upi' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    trackingId: String,
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
