import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Enter a valid email"
        }
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ["client", "Admin"],
        default: 'client'
    },
    detail: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    wish_list: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            deal: {
                type: Boolean,
                default: false
            }
        }
    ],
    reported: {
        type: Boolean,
        default: false
    },
    noReports: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
    
};

export const User = mongoose.model("User", userSchema);
