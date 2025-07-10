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

router.get('/summary', summary);
router.get('/sales-overview', salesOverview);
router.get('/category-distribution', categoryDistribution);
router.get('/top-products', topProducts);
router.get('/recent-activities', recentActivities);
router.get('/sales-target', salesTarget);

module.exports = router; 