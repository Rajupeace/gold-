# Evergreen Elegance - Deployment Guide

Your full-stack jewelry boutique is now deployed using a high-performance **Unified Architecture**. This setup combines the best of both worlds: Vercel for the lightning-fast frontend and Render for the powerful, persistent backend.

---

## 🌐 The Master Link
**Primary Website:** [https://gold-neon-sigma.vercel.app](https://gold-neon-sigma.vercel.app)

> [!IMPORTANT]
> **Why this link?**
> Even though you have two platforms (Vercel and Render), I have configured Vercel to act as the "bridge." When you visit the Vercel link, it now invisibly handles your database and API requests through Render. This ensures you have **one single URL** for your entire business.

---

## 🏗️ Architecture Overview

| Component | Platform | URL | Role |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | [gold-neon-sigma.vercel.app](https://gold-neon-sigma.vercel.app) | Serves the UI, images, and animations. |
| **Backend** | **Render** | [gold-backend-ob9o.onrender.com](https://gold-backend-ob9o.onrender.com) | Handles orders, payments, and user accounts. |
| **Database** | **MongoDB Atlas** | (User Provided) | Stores all your precious product and order data. |

---

## 🛠️ Required Final Configuration

For your store to start showing jewelry items, you **must** ensure your Render backend is connected to your database.

### 1. Update Render Environment Variables
1.  Log in to [Render Dashboard](https://dashboard.render.com).
2.  Open the **`gold-backend`** service.
3.  Go to the **Environment** tab.
4.  Verify/Add these variables:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: `EvergreenEleganceSecret2024`
    - `ADMIN_EMAIL`: `admin@viva-gold.com`
    - `ADMIN_PASSWORD`: `Admin@123`

### 2. Redeploy the Backend
1.  In the Render dashboard, click **Manual Deploy** > **Clear Cache & Deploy**.
2.  Wait for the logs to show: `✅ Connected to MongoDB` and `✅ Admin Synchronized`.

---

## ✨ Features Enabled
- **Automatic Seeding**: The first time your database connects, the store will automatically fill itself with 20+ premium gold and diamond items.
- **Admin Dashboard**: Accessible via `/admin` on your Vercel link. Use the Admin Email/Password above to log in.
- **Secure Payments**: Integrated with Razorpay (Demo Mode enabled).
- **Email Notifications**: Automated "Welcome" and "Order Confirmation" emails are ready to go.

---

**Your premium boutique is now ready for the world!**
