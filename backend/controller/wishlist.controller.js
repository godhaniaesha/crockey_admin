const Wishlist = require('../model/wishlist.model');

// Create a new wishlist
exports.createWishlist = async (req, res) => {
    try {
        const wishlist = new Wishlist(req.body);
        const savedWishlist = await wishlist.save();
        res.status(201).json(savedWishlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all wishlists
exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find()
            .populate('user_id')
            .populate('products');
        res.status(200).json(wishlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single wishlist by ID
exports.getWishlistById = async (req, res) => {
    try {
        const wishlist = await Wishlist.findById(req.params.id)
            .populate('user_id')
            .populate('products');
        if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a wishlist by ID
exports.updateWishlist = async (req, res) => {
    try {
        const updatedWishlist = await Wishlist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('user_id')
            .populate('products');
        if (!updatedWishlist) return res.status(404).json({ error: 'Wishlist not found' });
        res.status(200).json(updatedWishlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a wishlist by ID
exports.deleteWishlist = async (req, res) => {
    try {
        const deletedWishlist = await Wishlist.findByIdAndDelete(req.params.id);
        if (!deletedWishlist) return res.status(404).json({ error: 'Wishlist not found' });
        res.status(200).json({ message: 'Wishlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add product to wishlist
exports.addProduct = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        let wishlist = await Wishlist.findOne({ user_id });
        if (!wishlist) {
            wishlist = new Wishlist({ user_id, products: [product_id] });
        } else {
            if (!wishlist.products.includes(product_id)) {
                wishlist.products.push(product_id);
            }
        }
        const savedWishlist = await wishlist.save();
        res.status(200).json(savedWishlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove product from wishlist
exports.removeProduct = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;
        const wishlist = await Wishlist.findOne({ user_id });
        if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
        wishlist.products = wishlist.products.filter(p => p.toString() !== product_id);
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}; 