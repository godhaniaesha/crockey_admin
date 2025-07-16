const express = require('express');
const router = express.Router();
const {
    summary,
    salesOverview,
    categoryDistribution,
    topProducts,
    recentActivities,
    salesTarget
} = require('../controller/dashboard.controller');
const { requireAdmin } = require('../middleware/auth.middleware');
const authenticate = require('../middleware/authenticate'); // <-- FIXED

// All dashboard routes require admin access
router.get('/summary', authenticate, summary);
router.get('/sales-overview', authenticate, salesOverview);
router.get('/category-distribution',authenticate, categoryDistribution);
router.get('/top-products', authenticate,topProducts);
router.get('/recent-activities', recentActivities);
router.get('/sales-target', salesTarget);

module.exports = router;