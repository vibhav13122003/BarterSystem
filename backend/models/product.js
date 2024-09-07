import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    email: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    item: { type: String, required: true },
    status: { type: String, default: 'pending' },
    timestamp: { type: Date, default: Date.now },
     worth: { type: Number, required: true },
     category: { type: String, required: true },
    details: { type: String, required: true }, 

});
const productSchema = new mongoose.Schema({
    image: {
        public_id: String,
        url: String
    },
    image1: {
        public_id: String,
        url: String
    },
    image2: {
        public_id: String,
        url: String
    },
    image3: {
        public_id: String,
        url: String
    },
    detail: String,
    featured: Boolean,
    type: String,
    title: String,
    worth: Number,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    reported: Boolean,
    noReported: Number,
   
    user_email: String,
    user_name: String,
    name: String,
    stars: Number,
    bids: [bidSchema],
    bidAccepted: { type: Boolean, default: false },
    lat: Number,
    long: Number,
    category: String,
    expires_at: Date
});

export const Product = mongoose.model('Product', productSchema);
