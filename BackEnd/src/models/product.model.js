import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const ProductSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        image: { type: String, required: true },
        priceOriginal: { type: Number, required: true },
        priceFinal: { type: Number, required: false },
        stock: { type: Number, required: true },
        variant: [
            {
                name: { type: String, required: true },
                images: [
                    {
                        type: String,
                        required: true,
                    },
                ],
                stock: { type: Number, required: false },
            },
        ],
        description: { type: String, required: false },
        sold: { type: Number, required: false },
        slug: { type: String, slug: 'name' },
        rooms: [{ type: String, enum: ['Phòng khách', 'Phòng ngủ', 'Phòng làm việc', 'Phòng tắm', 'Phòng bếp'] }],
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    },
    {
        timestamps: true,
        versionKey: false,
    },
)

ProductSchema.index({ name: 'text', description: 'text' })

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
