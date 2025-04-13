import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const BlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        thumbnail: { type: String, required: true },
        slug: { type: String, slug: 'name' },
    },
    {
        timestamps: true,
        versionKey: false,
    },
)

module.exports = mongoose.model('Blog', BlogSchema)
