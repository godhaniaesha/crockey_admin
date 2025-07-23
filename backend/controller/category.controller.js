const Category = require('../model/category.model');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        // Check for existing category (case-insensitive)
        const existing = await Category.findOne({ name: req.body.name }).collation({ locale: 'en', strength: 2 });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Category name must be unique (case-insensitive)' });
        }
        const categoryData = {
            ...req.body,
            image: req.file ? req.file.filename : undefined,
            active: req.body.active !== undefined ? req.body.active : true
        };
        const category = new Category(categoryData);
        const savedCategory = await category.save();
        console.log(savedCategory,"savedCategory");
        
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

// Get all categories (with optional active filter)
exports.getAllCategories = async (req, res) => {
    try {
        const filter = {};
        if (req.query.active !== undefined) {
            filter.active = req.query.active === 'true';
        }
        const categories = await Category.find(filter);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get active categories only
exports.getActiveCategories = async (req, res) => {
    try {
        const categories = await Category.find({ active: true });
        // res.status(200).json(categories);
        // const categories = await Category.find();
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
        if (req.body.name) {
            const existing = await Category.findOne({ name: req.body.name, _id: { $ne: req.params.id } }).collation({ locale: 'en', strength: 2 });
            if (existing) {
                return res.status(400).json({ success: false, error: 'Category name must be unique (case-insensitive)' });
            }
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        // --- FIX: Map status to active ---
        if (req.body.status !== undefined) {
            updateData.active = req.body.status === "Active";
            delete updateData.status; // Remove status so it doesn't get saved as a field
        }
        // --- END FIX ---
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

// Toggle category active status
exports.toggleCategoryStatus = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        category.active = !category.active;
        await category.save();
        
        res.status(200).json({
            message: `Category ${category.active ? 'activated' : 'deactivated'} successfully`,
            category
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
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