const { sendLoginThankYou, sendOTP, sendWelcome, sendOrderConfirmation } = require('./emailService');
const nodemailer = require('nodemailer');

// Email transporter for admin alerts
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (user) => {
    try {
        await sendWelcome(user.email, user.name);
        console.log(`✉️ Welcome Email sent to: ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        return false;
    }
};

const sendLoginNotification = async (user) => {
    try {
        await sendLoginThankYou(user.email, user.name);
        console.log(`🔑 Login Email sent to: ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending login notification:', error);
        return false;
    }
};

const sendOTPNotification = async (user, otp) => {
    try {
        await sendOTP(user.email, otp);
        console.log(`🔑 OTP Email sent to: ${user.email}`);

        if (user.phone) {
            console.log(`📱 [SMS NOTIFICATION] To: ${user.phone}`);
            console.log(`✨ Message: Your Evergreen Elegance verification code is ${otp}. Valid for 10 minutes.`);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error sending OTP notification:', error);
        return false;
    }
};

const sendOrderConfirmationEmail = async (order, user) => {
    try {
        await sendOrderConfirmation(user.email, order);
        console.log(`📜 Order Confirmation Email sent to: ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
        return false;
    }
};

const sendOrderStatusUpdateNotification = async (order, user) => {
    try {
        const mailOptions = {
            from: '"Evergreen Elegance" <no-reply@evergreen-elegance.com>',
            to: user.email,
            subject: `Order Status Update - ${order.orderStatus.toUpperCase()}`,
            html: `
                <div style="font-family: 'Outfit', sans-serif; background-color: #000000; color: #ffffff; padding: 40px; border: 1px solid #e29c81; border-radius: 8px; max-width: 600px; margin: auto;">
                    <h1 style="color: #e29c81; text-align: center; font-family: 'Playfair Display', serif; letter-spacing: 2px;">EVERGREEN ELEGANCE</h1>
                    <div style="padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff;">Order Status Update</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #9a9a9a;">Your order #${order._id} status has been updated to: <strong style="color: #e29c81;">${order.orderStatus.toUpperCase()}</strong></p>
                        ${order.trackingId ? `<p style="font-size: 16px; line-height: 1.6; color: #9a9a9a;">Tracking ID: <strong>${order.trackingId}</strong></p>` : ''}
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`� Order Status Update Email sent to: ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending status update email:', error);
        return false;
    }
};

const sendAdminSaleAlert = async (order, user) => {
    try {
        const mailOptions = {
            from: '"Evergreen Elegance System" <no-reply@evergreen-elegance.com>',
            to: process.env.ADMIN_EMAIL || 'admin@evergreen-elegance.com',
            subject: '💎 New Sale Alert - Evergreen Elegance',
            html: `
                <div style="font-family: 'Outfit', sans-serif; background-color: #000000; color: #ffffff; padding: 40px; border: 1px solid #e29c81; border-radius: 8px;">
                    <h1 style="color: #e29c81;">💎 New Acquisition Confirmed</h1>
                    <p><strong>Client:</strong> ${user.name} (${user.email})</p>
                    <p><strong>Amount:</strong> $${order.totalAmount.toLocaleString()}</p>
                    <p><strong>Order ID:</strong> ${order._id}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    <hr style="border-color: #333; margin: 20px 0;">
                    <p><strong>Items:</strong></p>
                    ${order.items.map(item => `<p>• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}</p>`).join('')}
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`� Admin Sale Alert sent to: ${process.env.ADMIN_EMAIL || 'admin@evergreen-elegance.com'}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending admin alert email:', error);
        return false;
    }
};

module.exports = {
    sendWelcomeEmail,
    sendLoginNotification,
    sendOTPNotification,
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateNotification,
    sendAdminSaleAlert
};
