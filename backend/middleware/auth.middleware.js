const jwt = require('jsonwebtoken');
const { Register } = require('../model'); // Use the correct model name

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
        
        // Get user from database
        const user = await Register.findById(decoded._id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }



        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
    try {
        await authenticateToken(req, res, (err) => {
            if (err) return next(err);
            
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

// Middleware to check if user is seller
const requireSeller = async (req, res, next) => {
    try {
        await authenticateToken(req, res, (err) => {
            if (err) return next(err);
            
            if (req.user.role !== 'seller') {
                return res.status(403).json({
                    success: false,
                    message: 'Seller access required'
                });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

// Middleware to check if user is regular user
const requireUser = async (req, res, next) => {
    try {
        await authenticateToken(req, res, (err) => {
            if (err) return next(err);
            
            if (req.user.role !== 'user') {
                return res.status(403).json({
                    success: false,
                    message: 'User access required'
                });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

// Middleware to check if user is admin or seller
const requireAdminOrSeller = async (req, res, next) => {
    try {
        await authenticateToken(req, res, (err) => {
            if (err) return next(err);
            
            if (req.user.role !== 'admin' && req.user.role !== 'seller') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin or seller access required'
                });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

// Middleware to check if user is admin or user
const requireAdminOrUser = async (req, res, next) => {
    try {
        await authenticateToken(req, res, (err) => {
            if (err) return next(err);
            
            if (req.user.role !== 'admin' && req.user.role !== 'user') {
                return res.status(403).json({
                    success: false,
                    message: 'Admin or user access required'
                });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

// Middleware to check if user owns the resource (for sellers/users to access their own data)
const requireOwnership = async (req, res, next) => {
    try {
        await authenticateToken(req, res, (err) => {
            if (err) return next(err);
            
            const resourceUserId = req.params.userId || req.params.id;
            
            // Admin can access any resource
            if (req.user.role === 'admin') {
                return next();
            }
            
            // Users can only access their own resources
            if (req.user._id.toString() !== resourceUserId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only access your own data.'
                });
            }
            
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

// Middleware to check if seller owns the resource
const requireSellerOwnership = async (req, res, next) => {
    try {
        await authenticateToken(req, res, (err) => {
            if (err) return next(err);
            
            if (req.user.role !== 'seller') {
                return res.status(403).json({
                    success: false,
                    message: 'Seller access required'
                });
            }
            
            const resourceSellerId = req.params.sellerId || req.params.id;
            
            // Check if the seller owns this resource
            if (req.user._id.toString() !== resourceSellerId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only access your own data.'
                });
            }
            
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error'
        });
    }
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireSeller,
    requireUser,
    requireAdminOrSeller,
    requireAdminOrUser,
    requireOwnership,
    requireSellerOwnership
}; 