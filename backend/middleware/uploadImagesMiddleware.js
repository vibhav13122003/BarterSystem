import multer from 'multer';

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Export the middleware
export const uploadImagesMiddleware = upload.array('images'); // M=
