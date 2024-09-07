import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define Feedback Schema
const feedbackSchema = new Schema({
    rating: {
        type: Number,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
});

export const Feedback = mongoose.model("Feedack", feedbackSchema);
