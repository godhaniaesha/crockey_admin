const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getUserOrders,
    getSellerOrders,
    getSellerPayouts,
    updatePayoutStatus,
    getAllPayouts,
    getSellerIncome,
    updateBankDetails,
    requestWithdrawal,
    getAllSellersIncome,
    getOrdersByUserId
} = require('../controller/order.controller');
const { 
    authenticateToken, 
    requireAdmin, 
    requireOwnership,
    requireSeller,
    requireAdminOrSeller
} = require('../middleware/auth.middleware');

// Place order (authenticated user)
router.post('/', authenticateToken, placeOrder);

// Get all orders (admin only)
router.get('/', requireAdmin, getAllOrders);

// Get all orders (admin only)
router.get('/orders/user/:userId', authenticateToken, getOrdersByUserId);

// Get user's own orders (authenticated user)
router.get('/my-orders', authenticateToken, getUserOrders);

// Get seller's product orders (seller only)
router.get('/seller-orders', authenticateToken, requireAdminOrSeller,getSellerOrders);

// Get seller's payouts (seller only)
router.get('/seller-payouts', authenticateToken, requireSeller, getSellerPayouts);

// Get seller's income (seller only)
router.get('/seller-income', authenticateToken, requireSeller, getSellerIncome);

// Update seller bank details (seller only)
router.put('/seller-bank-details', authenticateToken, requireSeller, updateBankDetails);

// Request withdrawal (seller only)
router.post('/seller-withdrawal', authenticateToken, requireSeller, requestWithdrawal);

// Get all payouts (admin only)
router.get('/payouts', requireAdmin, getAllPayouts);

// Get all sellers income (admin only)
router.get('/sellers-income', requireAdmin, getAllSellersIncome);

// Update payout status (admin only)
router.put('/payouts/:id/status', requireAdmin, updatePayoutStatus);

// Get specific order (admin or order owner)
router.get('/:id', authenticateToken, requireOwnership, getOrderById);

// Update order status (admin only)
router.put('/:id/status', requireAdmin, updateOrderStatus);

// Update payment status (admin only)
router.put('/:id/payment', requireAdmin, updatePaymentStatus);

// Cancel order (admin only)
router.delete('/:id', requireAdmin, cancelOrder);

module.exports = router; 