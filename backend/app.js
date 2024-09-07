import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { Server } from 'socket.io';
import path from 'path';
import http from 'http';

// Resolve the directory name
const __dirname = path.resolve();

// Load environment variables
dotenv.config({ path: './config/.env' });

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Your frontend URL
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
global.io = io;


const users = {}; // Store users and their socket IDs

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    
    socket.on('register', (user_id) => {
        // Store the user's socket ID associated with their user_id
        users[user_id] = socket.id;
        console.log(`User registered with ID: ${user_id} and socket ID: ${socket.id}`);
    });

    // Handle user disconnection and remove the user from the list
    socket.on('disconnect', () => {
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });
});


// Database connection
const dbConnection = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error('MONGO_URL is not defined');
        }
        await mongoose.connect(mongoUrl);
        console.log('Database connected');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
};
dbConnection();

// Express middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

const upload = multer({ dest: 'uploads/' });

app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // adjust to your frontend's URL
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use('/user', userRouter);
app.use('/products', productRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Middleware:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

app.use(errorMiddleware);

export default server; 
export { users };