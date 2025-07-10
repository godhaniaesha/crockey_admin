const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
} = require('../controller/order.controller');

// Place order
router.post('/', placeOrder);
// Get all orders
router.get('/', getAllOrders);
// Get order by ID
router.get('/:id', getOrderById);
// Update order status
router.put('/:id/status', updateOrderStatus);
// Update payment status
router.put('/:id/payment', updatePaymentStatus);
// Cancel order
router.delete('/:id', cancelOrder);

module.exports = router; 