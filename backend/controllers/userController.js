import { User } from '../models/user.js';
import { generateToken } from '../utils/jwt.js';
import ErrorHandler from '../middleware/errorMiddleware.js';
import { Product } from "../models/product.js";
import mongoose from "mongoose";
import { Chat } from "../models/chat.js";
import { EnabledChat } from "../models/enableChat.js";
export const registerUser = async (req, res, next) => {
    console.log('Register User Called'); 
    try {
        const { name, email, password} = req.body;
        console.log('Request Body:', req.body); 
        if (!name || !email || !password) {
            throw new ErrorHandler('Please fill pass all required fields', 400);
        }

        let user = await User.findOne({ email });
        if (user) {
            throw new ErrorHandler('User already exists with this email', 400);
        }

        user = await User.create({
            name,
            email,
            password,
            role: 'client',
            detail: '',
            rating: 0,
            wish_list: []
        });

        console.log('User Created:', user); // Add log here
         generateToken(user, 'User registered successfully', 201, res);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            throw new ErrorHandler('Please fill in all required fields', 400);
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ErrorHandler('Invalid email or password', 401);
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new ErrorHandler('Invalid email or password', 401);
        }

        if (role !== user.role) {
            throw new ErrorHandler('User Not Found With This Role!', 400);
        }

        generateToken(user, 'User logged in successfully', 200, res);
    } catch (error) {
        next(error);
    }
};

export const logout=async(req,res)=>{
    res.status(200).cookie("clientToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "client logged out"
    })
}


export const updateWishList = async (req, res) => {
    try {
        const userId = req.body.id;
        const productId = req.body.product_id;
        const updateType = req.body.type;

        let user = await User.findById(userId).exec();

        if (!user) {
            
            return res.status(404).json({ message: 'User not found' });
        }

        if (updateType === 'remove') {
            user.wish_list = user.wish_list.filter(item => item.toString() !== productId);
        } else {
            if (!user.wish_list.includes(productId)) {
                user.wish_list.push(productId);
            }
        }

        await user.save();

        console.log(user);
        res.json('done');
    } catch (err) {
        console.log('err', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateReportedUser=async(req,res)=>{
    try{
        const email= req.body.email;
        const type=req.body.type;
        let user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(type==='remove'){
            user.reported=false
            user.noReports = Math.max(0, (user.noReports || 1) - 1);
        }
        else{
            user.reported=true
            user.noReports = (user.noReports || 0) + 1;
        }

        await user.save();

        res.json('done');
    }
    catch(err){
        res.status(500).json({message:'Internal server error'})
    }
}

export const isReported=async(req,res)=>{
    try{
        const email= req.body.email;
        let user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({reported:user.reported,noReports:user.noReports});
    }
    catch(err){
        res.status(500).json({message:'Internal server error'})
    }
}
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).exec();
        res.json({ users });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
// Set enabled users (start a chat)
export const setEnableUsers = async (req, res) => {
    const sender = req.params.id;
    const { id2 } = req.body;

    console.log('Sender ID:', sender);
    console.log('Receiver ID (id2):', id2);

    if (!sender || !id2) {
        return res.status(400).json({ error: 'Both sender and receiver IDs must be provided' });
    }

    try {
        const chat = new EnabledChat({
            users: [sender, id2]  // Store both user IDs in an array
        });
        await chat.save();
        return res.status(200).json({ chatId: chat._id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error!" });
    }
};

// Get enabled users (retrieve all chats for a user)
export const getEnabledUsers = async (req, res) => {
    const sender = req.params.id;
    console.log('Fetching enabled users for:', sender);

    try {
        
        const chats = await EnabledChat.find({ users: sender });
        console.log('Fetched chats:', chats);
        return res.json(chats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error!" });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    const sender = req.params.id;
    const { receiver, message } = req.body;

    try {
        const chat = new Chat({
            sender,
            receiver,
            message
        });

        await chat.save();
        res.status(200).json({ chat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error!" });
    }
};

// Get all chats
export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find().sort({ createdAt: 1 });
        return res.json(chats);
    } catch (err) {
        console.error(err);
        return res.status(500).json("Server Error!");
    }
};
