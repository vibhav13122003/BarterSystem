import mongoose from 'mongoose';

const EnabledChatSchema = new mongoose.Schema({
    users: {
        type:[String],
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

export const EnabledChat = mongoose.model('EnabledChat', EnabledChatSchema);
