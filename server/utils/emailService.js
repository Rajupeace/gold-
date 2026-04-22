const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOrderConfirmation = async (userEmail, orderDetails) => {
    try {
        const mailOptions = {
            from: '"Evergreen Elegance" <no-reply@evergreen-elegance.com>',
            to: userEmail,
            subject: 'Acquisition Confirmation - Evergreen Elegance',
            html: `
                <div style="font-family: 'serif'; background-color: #0a0a0a; color: #ffffff; padding: 40px; border: 1px solid #e29c81;">
                    <h1 style="color: #e29c81; text-align: center;">EVERGREEN ELEGANCE</h1>
                    <p>Thank you for your acquisition!</p>
                    <p>Order ID: <strong>${orderDetails._id}</strong></p>
                    <p>Total Amount: <strong>$${orderDetails.totalAmount}</strong></p>
                    <hr style="border: 0.5px solid #e29c81;" />
                    <p>We are processing your exquisite pieces and will notify you once they are shipped.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email Error:', error);
    }
};

exports.sendLoginThankYou = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: '"Evergreen Elegance" <no-reply@evergreen-elegance.com>',
            to: userEmail,
            subject: 'Welcome Back - Evergreen Elegance',
            html: `
                <div style="font-family: 'Outfit', sans-serif; background-color: #000000; color: #ffffff; padding: 40px; border: 1px solid #e29c81; border-radius: 8px; max-width: 600px; margin: auto;">
                    <h1 style="color: #e29c81; text-align: center; font-family: 'Playfair Display', serif; letter-spacing: 2px;">EVERGREEN ELEGANCE</h1>
                    <div style="padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff;">Hello, ${userName}!</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #9a9a9a;">Thank you for logging into your account. We are honored to have you back in our world of timeless luxury.</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #9a9a9a;">If this wasn't you, please secure your account immediately.</p>
                        <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #1a1a1a;">
                            <p style="font-size: 14px; color: #e29c81;">Exclusively Yours,</p>
                            <p style="font-size: 14px; font-weight: bold; color: #ffffff;">The Evergreen Team</p>
                        </div>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email Error (Login Notification):', error);
    }
};

exports.sendOTP = async (userEmail, otp) => {
    try {
        const mailOptions = {
            from: '"Evergreen Elegance" <no-reply@evergreen-elegance.com>',
            to: userEmail,
            subject: 'Verification Code - Evergreen Elegance',
            html: `
                <div style="font-family: 'Outfit', sans-serif; background-color: #000000; color: #ffffff; padding: 40px; border: 1px solid #e29c81; border-radius: 8px; max-width: 600px; margin: auto;">
                    <h1 style="color: #e29c81; text-align: center; font-family: 'Playfair Display', serif; letter-spacing: 2px;">EVERGREEN ELEGANCE</h1>
                    <div style="padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff;">Security Verification</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #9a9a9a;">You requested a password reset. Use the following code to proceed. This code is valid for 10 minutes.</p>
                        <div style="background-color: #1a1a1a; padding: 20px; margin: 20px 0; border-radius: 4px;">
                            <span style="font-size: 32px; font-weight: bold; color: #e29c81; letter-spacing: 5px;">${otp}</span>
                        </div>
                        <p style="font-size: 14px; color: #9a9a9a;">If you did not request this, please ignore this email.</p>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email Error (OTP):', error);
    }
};

exports.sendWelcome = async (userEmail, userName) => {
    try {
        const mailOptions = {
            from: '"Evergreen Elegance" <no-reply@evergreen-elegance.com>',
            to: userEmail,
            subject: 'Welcome to the Circle of Elegance',
            html: `
                <div style="font-family: 'Outfit', sans-serif; background-color: #000000; color: #ffffff; padding: 40px; border: 1px solid #e29c81; border-radius: 8px; max-width: 600px; margin: auto;">
                    <h1 style="color: #e29c81; text-align: center; font-family: 'Playfair Display', serif; letter-spacing: 2px;">EVERGREEN ELEGANCE</h1>
                    <div style="padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff;">Welcome, ${userName}!</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #9a9a9a;">Your journey into the world of exquisite gold and diamonds begins now. We are delighted to have you as part of our prestigious community.</p>
                        <p style="font-size: 16px; line-height: 1.6; color: #9a9a9a;">Explore our collections and find the piece that speaks to your legacy.</p>
                        <div style="margin-top: 30px; padding: 20px; border-top: 1px solid #1a1a1a;">
                            <a href="http://localhost:5173" style="background-color: #e29c81; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; font-size: 14px;">Explore Collection</a>
                        </div>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email Error (Welcome):', error);
    }
};
