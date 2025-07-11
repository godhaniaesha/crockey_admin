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

// All dashboard routes require admin access
router.get('/summary', requireAdmin, summary);
router.get('/sales-overview', requireAdmin, salesOverview);
router.get('/category-distribution', requireAdmin, categoryDistribution);
router.get('/top-products', requireAdmin, topProducts);
router.get('/recent-activities', requireAdmin, recentActivities);
router.get('/sales-target', requireAdmin, salesTarget);

module.exports = router; 