
require('dotenv').config()
 
const express = require('express');
// console.log("express");
 
const path = require('path')
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');
 
const routers = require('./router');
const connectDB = require('./db');
 
app.use(cookieParser());
app.use("/KAssets", express.static(path.join(__dirname, "KAssets")));
 
// Session middleware configuration
app.use(session({
    secret: 'sdh@hehf',
    resave: true,
    saveUninitialized: true,
}));
 
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
 
const port = process.env.PORT || 2221
 
 
connectDB()
 
// Mount each router individually
app.use('/api/auth', routers.authRoutes);
app.use('/api/categories', routers.categoryRoutes);
app.use('/api/products', routers.productRoutes);
app.use('/api/subcategories', routers.subcategoryRoutes);
app.use('/api/coupons', routers.couponRoutes);
app.use('/api/offers', routers.offerRoutes);
app.use('/api/carts', routers.cartRoutes);
app.use('/api/wishlists', routers.wishlistRoutes);
app.use('/api/orders', routers.orderRoutes);
app.use('/api/dashboard', routers.dashboardRoutes);
 
// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

