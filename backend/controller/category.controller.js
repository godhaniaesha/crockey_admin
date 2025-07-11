const Category = require('../model/category.model');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        // Support form-data: req.body for text, req.file for image
        const categoryData = {
            ...req.body,
            image: req.file ? req.file.filename : undefined
        };
        const category = new Category(categoryData);
        const savedCategory = await category.save();
        res.status(201).json({
            success: true,
            result: savedCategory,
            message: 'Category created successfully'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            result: categories,
            message: 'Categories fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ 
            success: false,
            error: 'Category not found' 
        });
        res.status(200).json({
            success: true,
            result: category,
            message: 'Category fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ 
                success: false,
                error: 'Category not found' 
            });
        }
        res.status(200).json({
            success: true,
            result: updatedCategory,
            message: 'Category updated successfully'
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ 
            success: false,
            error: 'Category not found' 
        });
        res.status(200).json({ 
            success: true,
            message: 'Category deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
}; 