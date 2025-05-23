// const mongoose = require('mongoose')
import mongoose from 'mongoose'
// const bcryptjs = require('bcryptjs')

const UserSchema = mongoose.Schema(
    {
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        firstName: { type: String, require: true },
        lastName: { type: String, require: true },
        displayName: { type: String, require: true },
        gender: { type: Boolean, require: true },
        birthDate: { type: String, require: true },
        role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
        avatar: {
            type: String,
            default: 'https://res.cloudinary.com/dezywk7nm/image/upload/v1743777314/default-avatar_stq3ir.jpg',
        },
        // status: { type: Number, require: false },
        resetPasswordToken: { type: String, require: false },
        resetPasswordExpires: { type: Date, require: false },
        wishlists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    },
    { timestamps: true, versionKey: false },
)

const User = mongoose.model('User', UserSchema)

module.exports = User
