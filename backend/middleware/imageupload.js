// backend/middleware/imageupload.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const dotenv = require('dotenv');

dotenv.config();

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads'; // Default path

        if (file.fieldname === 'supplyer_image') {
            uploadPath = 'uploads/supplyer_image';
        } else if (file.fieldname === 'category_image') {
            uploadPath = 'uploads/category_image';
        } else if (file.fieldname === 'item_image') {
            uploadPath = 'uploads/item_image';
        } else if (file.fieldname === 'hotel_image') {
            uploadPath = 'uploads/hotel_image';
        } else if (file.fieldname === 'dish_image') {
            uploadPath = 'uploads/dish_image';
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedFieldNames = ['image', 'supplyer_image', 'category_image', 'item_image', 'dish_image', 'hotel_image'];
    if (allowedFieldNames.includes(file.fieldname)) {
        cb(null, true);
    } else {
        cb(new Error(`Please upload a file with one of these field names: ${allowedFieldNames.join(', ')}`));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const uploadHandlers = {
    single: (fieldName) => upload.single(fieldName)
};

const handleMulterError = (err, req, res, next) => {
    console.log('Upload error:', err);
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
};

const convertJfifToJpeg = async (req, res, next) => {
    try {
        if (!req.file) return next();
        const file = req.file;
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.jfif' || file.mimetype === 'image/jfif' || file.mimetype === 'application/octet-stream') {
            const inputPath = file.path;
            const outputPath = inputPath.replace('.jfif', '.jpg');
            await sharp(inputPath).jpeg().toFile(outputPath);
            file.path = outputPath;
            file.filename = path.basename(outputPath);
            fs.unlinkSync(inputPath);
        }
        next();
    } catch (err) {
        console.error('Error in convertJfifToJpeg:', err);
        next(err);
    }
};

module.exports = { upload, uploadHandlers, handleMulterError, convertJfifToJpeg };
