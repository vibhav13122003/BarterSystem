import server from './app.js'; // Import the HTTP server from app.js
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

// Load environment variables
dotenv.config({ path: "./config/.env" });

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define the port
const PORT = process.env.PORT || 8000;

// Start the server
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
