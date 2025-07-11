const Subcategory = require('../model/subcategory.model');

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
    try {
        const subcategoryData = {
            ...req.body,
            image: req.file ? req.file.filename : undefined
        };
        const subcategory = new Subcategory(subcategoryData);
        const savedSubcategory = await subcategory.save();
        res.status(201).json(savedSubcategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('category_id');
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single subcategory by ID
exports.getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('category_id');
        if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' });
        res.status(200).json(subcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a subcategory by ID
exports.updateSubcategory = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        const updatedSubcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedSubcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        res.status(200).json(updatedSubcategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a subcategory by ID
exports.deleteSubcategory = async (req, res) => {
    try {
        const deletedSubcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!deletedSubcategory) return res.status(404).json({ error: 'Subcategory not found' });
        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 