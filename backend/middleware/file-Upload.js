import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Define the MIME type map to ensure correct file extensions
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
};

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');  // Adjust the destination folder as needed
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${uuidv4()}${Date.now()}.${ext}`);
    },
});

// Set up the Multer middleware
const fileUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    },
});

export default fileUpload;
