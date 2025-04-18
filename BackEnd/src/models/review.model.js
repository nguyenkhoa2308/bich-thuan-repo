const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        content: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    },
)

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review
