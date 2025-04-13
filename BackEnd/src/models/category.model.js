import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const CategorySchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        displayName: { type: String, required: true },
        slug: { type: String, slug: 'name' },
    },
    {
        timestamps: true,
        versionKey: false,
    },
)

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category
