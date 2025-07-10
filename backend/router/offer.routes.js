const express = require('express');
const router = express.Router();
const {
    createOffer,
    getAllOffers,
    getOfferById,
    updateOffer,
    deleteOffer
} = require('../controller/offer.controller');

// Create
router.post('/', createOffer);
// Read all
router.get('/', getAllOffers);
// Read one
router.get('/:id', getOfferById);
// Update
router.put('/:id', updateOffer);
// Delete
router.delete('/:id', deleteOffer);

module.exports = router; 