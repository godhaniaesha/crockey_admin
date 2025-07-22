const Subcategory = require('../model/subcategory.model');
const Product = require('../model/product.model');
const Category = require('../model/category.model');

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
    try {
        // Check for existing subcategory (case-insensitive)
        const existing = await Subcategory.findOne({ name: req.body.name }).collation({ locale: 'en', strength: 2 });
        if (existing) {
            return res.status(400).json({ error: 'Subcategory name must be unique (case-insensitive)' });
        }
        const subcategoryData = {
            ...req.body,
            image: req.file ? req.file.filename : undefined,
            active: req.body.active !== undefined ? req.body.active : true
        };
        const subcategory = new Subcategory(subcategoryData);
        const savedSubcategory = await subcategory.save();
        res.status(201).json(savedSubcategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all subcategories (with optional active filter)
exports.getAllSubcategories = async (req, res) => {
    try {
        const filter = {};
        if (req.query.active !== undefined) {
            filter.active = req.query.active === 'true';
        }
        const subcategories = await Subcategory.find(filter).populate('category_id');
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get active subcategories only
exports.getActiveSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find({ active: true }).populate('category_id');
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
        if (req.body.name) {
            const existing = await Subcategory.findOne({ name: req.body.name, _id: { $ne: req.params.id } }).collation({ locale: 'en', strength: 2 });
            if (existing) {
                return res.status(400).json({ error: 'Subcategory name must be unique (case-insensitive)' });
            }
        }
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.filename;
        }
        // Map status to active boolean
        if (updateData.status !== undefined) {
            updateData.active = updateData.status === 'Active';
            delete updateData.status;
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

// Toggle subcategory active status
exports.toggleSubcategoryStatus = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id);
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        
        subcategory.active = !subcategory.active;
        await subcategory.save();

        // Cascade to products
        await Product.updateMany(
            { subcategory_id: subcategory._id },
            { $set: { active: subcategory.active } }
        );
        
        res.status(200).json({
            message: `Subcategory ${subcategory.active ? 'activated' : 'deactivated'} successfully`,
            subcategory
        });
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

exports.toggleCategoryStatus = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        category.active = !category.active;
        await category.save();

        // Cascade to subcategories
        await Subcategory.updateMany(
            { category_id: category._id },
            { $set: { active: category.active } }
        );

        // Cascade to products
        await Product.updateMany(
            { category_id: category._id },
            { $set: { active: category.active } }
        );
        
        res.status(200).json({
            message: `Category ${category.active ? 'activated' : 'deactivated'} successfully`,
            category
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};