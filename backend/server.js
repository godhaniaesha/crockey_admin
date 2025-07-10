const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
 
const router = require('./router/auth.routes')
 
const app = express();
 
// ==================== MIDDLEWARE ====================
 
// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));
 
// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
 
// Cookie parser middleware
app.use(cookieParser());
 
// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
 
// ==================== DATABASE CONNECTION ====================
 
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL || 'mongodb://localhost:27017/crockey_admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
 
// ==================== ROUTES ====================
 
// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});
 
// Mount auth routes
app.use('/api/auth', router);
 
// ==================== ERROR HANDLING MIDDLEWARE ====================
 
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
 
// Global error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
   
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            error: error.message
        });
    }
   
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format',
            error: error.message
        });
    }
   
    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Duplicate field value',
            error: error.message
        });
    }
   
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});
 
// ==================== SERVER STARTUP ====================
 
const PORT = process.env.PORT || 5000;
 
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();
       
        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Server startup error:', error);
        process.exit(1);
    }
};
 
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
 
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});
 
// Start the server
startServer();
 
module.exports = app;