import { Product } from '../models/product.js';
import cloudinary from 'cloudinary';
import mongoose from "mongoose";

import { User } from "../models/user.js";
import { Feedback } from "../models/feedback.js";
import { users } from "../app.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: 'products', resource_type: 'image' },
            (error, result) => {
                if (error) {
                    reject(new Error('Image upload failed: ' + error.message));
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        uploadStream.end(buffer);
    });
};
export const registerProduct = async (req, res, next) => {
    const data = req.body;
    const files = req.files;

    try {
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ message: "No files were uploaded." });
        }

        const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
        const imageFiles = ['image', 'image1', 'image2', 'image3'];

        const images = await Promise.all(imageFiles.map(async (field) => {
            if (!files[field] || !allowedFormats.includes(files[field][0].mimetype)) {
                throw new Error(`Invalid file format for ${field}`);
            }
            return await uploadImage(files[field][0].buffer);
        }));

        // Helper function to safely parse numbers
        const parseNumber = (field, value) => {
            if (value === null || value === undefined) {
                return 0; // or any default value you prefer
            }
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) {
                throw new Error(`Invalid number format for field: ${field}, value: ${value}`);
            }
            return parsedValue;
        };

        const noReported = data.noReported ? parseInt(data.noReported, 10) : 0;
        if (isNaN(noReported)) {
            return res.status(400).json({ message: 'Invalid number format for noReported.' });
        }

        // Parsing lat and long as numbers
        const lat = parseNumber('lat', data.lat);
        const long = parseNumber('long', data.long);

        const product = new Product({
            image: { url: images[0] || '', public_id: images[0] || '' },
            image1: { url: images[1] || '', public_id: images[1] || '' },
            image2: { url: images[2] || '', public_id: images[2] || '' },
            image3: { url: images[3] || '', public_id: images[3] || '' },
            detail: data.detail,
            featured: data.featured === 'true',
            type: data.type,
            title: data.title,
            worth: parseNumber('worth', data.worth),
            user_id: data.user_id,
            reported: data.reported === 'true',
            noReported: noReported,
            user_email: data.user_email,
            user_name: data.user_name,
            name: data.name,
            stars: data.stars ? parseNumber('stars', data.stars) : 0,
            bids: [],
            lat: parseNumber('lat', data.lat),  // Handle as number
            long: parseNumber('long', data.long),  // Handle as number
            category: data.category,
            expires_at: new Date(new Date().setDate(new Date().getDate() + parseInt(data.expires_at, 10))),
        });

        await product.save();
        res.json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Update path as necessary



export const postBid = async (req, res) => {
    try {
        const { id } = req.params; // Product ID
        const { email, item, worth, category, details, user_id } = req.body;

        console.log('Incoming data:', req.body);

        if (!email || !item || !worth || !category || !details || !user_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create the bid object
        const bid = {
            email,
            item,
            worth,
            category,
            details,
            product_id: id,
            user_id
        };

        await Product.updateOne(
            { _id: id },
            { $push: { bids: bid } }
        );

        // Emit a notification to the product owner if they're connected
        const ownerSocketId = users[product.user_id.toString()]; // Get owner's socket ID
        if (ownerSocketId) {
            global.io.to(ownerSocketId).emit('newBid', {
                product_id: id,
                bid
            });
            console.log('Emitting newBid event to owner:', product.user_id.toString());
        } else {
            console.log('Owner is not connected');
        }

        // Respond with the updated product
        res.status(200).json({ bid });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err);
    }
};





export const searchItem = async (req, res) => {
    try {
        const name = req.query.name;
        const regex = new RegExp(name, 'i');
        const users = await Product.find({ title: regex });
        const count = await Product.countDocuments();

        res.status(200).json({ users, count });
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
}

export const getProductsById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        res.send(product ? product : "Product not found!");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 }); // 
        res.json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
export const updateProducts = async (req, res) => {
    const { id } = req.params;
    try {
        const data = req.body;
        if (req.file) {
            data.image = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
        res.send({ msg: "Product updated!", updatedProduct });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
export const deleteProducts = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.json({ msg: "Deleted Successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const acceptBid = async (req, res) => {
    const { id } = req.params;
    const { bidId, action } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.bidAccepted) {
            return res.status(400).json({ message: 'Product has already been sold' });
        }

        if (!bidId || !action) {
            return res.status(400).json({ message: 'bidId and action fields are required' });
        }

        const bid = product.bids.id(bidId);
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found' });
        }

        switch (action) {
            case 'accept':
                bid.status = 'accepted';
                product.bidAccepted = true;
                break;
            case 'reject':
                bid.status = 'rejected';
                break;
            case 'stall':
                bid.status = 'stalled';
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }

        await product.save();

        if (action === 'accept') {
            const user = await User.findOneAndUpdate(
                { email: bid.email },
                { $push: { wish_list: { product: id, deal: true } } }, // Assuming wish_list is an array
                { new: true }
            );
            if (!user) {
                return res.status(500).json({ message: 'Failed to update user deal' });
            }
        }

        res.json({ updatedProduct: product, updatedBid: bid });
    } catch (err) {
        console.error('Error in acceptBid:', err);
        res.status(500).json({ message: err.message });
    }
};


export const postFeedback = async (req, res) => {
    const { feedback, user_id, rating, email } = req.body;
    const { id } = req.params;

    try {
       
        console.log('Request body:', req.body);
        console.log('Product ID (param):', id);


        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            { $set: { stars: rating, rating } },
            { new: true }
        );

       
        console.log('Updated user:', updatedUser);

        const feedbackData = {
            rating,
            feedback,
            product_id: id,
            user_email: updatedUser.email,
            email
        };

        // Log feedback data
        console.log('Feedback data:', feedbackData);

        // Save the feedback
        const feedbackObj = new Feedback(feedbackData);
        await feedbackObj.save();

        // Clear deal flag for user
        await User.findByIdAndUpdate(user_id, { deal: false });

        res.json(feedbackObj);
    } catch (err) {
        console.error('Error in postFeedback:', err);
        res.status(500).json({ message: err.message });
    }
};


export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.json({ feedbacks });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};


export const deleteFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        await Feedback.findByIdAndDelete(id);
        res.json({ msg: "Deleted Successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const editFeedback = async (req, res) => {
    const { id } = req.params;
    const { feedback, rating, email } = req.body;
    try {

        const user = await User.findOne({ email });
        await User.findByIdAndUpdate(user._id, { $set: { stars: rating, rating } }, { new: true });


        const updatedFeedback = await Feedback.findByIdAndUpdate(id, { feedback }, { new: true });

        res.send({ msg: "Feedback updated!", updatedFeedback });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
