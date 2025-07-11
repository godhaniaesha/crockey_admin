const express = require('express');
const router = express.Router();
const {
    createOffer,
    getAllOffers,
    getOfferById,
    updateOffer,
    deleteOffer
} = require('../controller/offer.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

// All offer management routes require admin access
router.post('/', requireAdmin, createOffer);
router.get('/', getAllOffers); // Public access for viewing offers
router.get('/:id', getOfferById); // Public access for viewing offer
router.put('/:id', requireAdmin, updateOffer);
router.delete('/:id', requireAdmin, deleteOffer);

module.exports = router; 