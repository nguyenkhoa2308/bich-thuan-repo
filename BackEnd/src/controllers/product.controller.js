/* eslint-disable indent */
const Product = require('~/models/product.model')
// const removeAccents = require('remove-accents')
const slugify = require('slugify')
const Category = require('~/models/category.model')
import Review from '~/models/review.model'

const getProducts = async (req, res) => {
    try {
        const { type, limit = 12 } = req.query
        let products = []

        // const product = await Product.find().populate('category')
        if (type) {
            if (type === 'featured') {
                products = await Product.find({ isFeatured: true }).limit(Number(limit))
            } else if (type === 'best-seller') {
                products = await Product.find().sort({ sold: -1 }).limit(Number(limit)) // Sắp xếp theo `sold` giảm dần
            } else if (type === 'new-arrival') {
                products = await Product.find().sort({ createdAt: -1 }).limit(Number(limit)) // Sắp xếp theo `createdAt`
            } else {
                return res.status(400).json({ message: 'Loại sản phẩm không hợp lệ' })
            }
        } else {
            products = await Product.find() // Không có type, lấy tất cả sản phẩm
        }
        res.status(200).json(products)
        // if (product) {
        // res.status(200).json(product)
        // } else {
        //     res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        // }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProductsByCategoryOrRoom = async (req, res) => {
    try {
        const { categoryOrRoom } = req.params
        const { brand, priceRanges, sortBy } = req.query

        let sortOptions = {}

        switch (sortBy) {
            case 'price_asc':
                sortOptions.priceFinal = 1 // Giá tăng dần
                break
            case 'price_desc':
                sortOptions.priceFinal = -1 // Giá giảm dần
                break
            case 'name_asc':
                sortOptions.slug = 1 // Tên từ A-Z
                break
            case 'name_desc':
                sortOptions.slug = -1 // Tên từ Z-A
                break
            case 'newest':
                sortOptions.createdAt = -1 // Mới nhất
                break
            case 'oldest':
                sortOptions.createdAt = 1 // Cũ nhất
                break
            case 'best_seller':
                sortOptions.sold = 1 // Bán chạy nhất
                break
            default:
                break
        }

        // Danh sách slug rooms
        const ROOM_SLUGS = {
            'living-room': 'Phòng khách',
            bedroom: 'Phòng ngủ',
            office: 'Phòng làm việc',
            bathroom: 'Phòng tắm',
            kitchen: 'Phòng bếp',
        }

        let filter = {}

        // Nếu categoryOrRoom nằm trong danh sách rooms
        if (ROOM_SLUGS[categoryOrRoom]) {
            filter.rooms = ROOM_SLUGS[categoryOrRoom]
        } else {
            // Tìm category theo slug
            const category = await Category.findOne({ slug: categoryOrRoom })
            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy danh mục' })
            }
            filter.category = category._id
        }

        if (brand) {
            const brandArray = Array.isArray(brand) ? brand : [brand]
            filter.brand = { $in: brandArray }
        }

        if (priceRanges) {
            const rangesArray = Array.isArray(priceRanges) ? priceRanges : [priceRanges]

            const priceConditions = rangesArray.map((range) => {
                if (range === '<1000000') {
                    return { priceFinal: { $lt: 1000 } }
                } else if (range === '>4000000') {
                    return { priceFinal: { $gt: 4000 } }
                } else {
                    const [min, max] = range.split('-').map(Number)
                    return { priceFinal: { $gte: min / 1000, $lte: max / 1000 } }
                }
            })

            filter.$or = priceConditions
        }

        // Lấy sản phẩm theo category hoặc room
        const products = await Product.find(filter).populate('category').sort(sortOptions)

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error })
    }
}

const getProductById = async (req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findOne({ _id: id }).populate('category')
        if (product) {
            res.status(200).json(product)
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProductBySlug = async (req, res) => {
    const slug = req.params.slug
    try {
        const product = await Product.findOne({ slug })
            .populate('category')
            .populate({ path: 'reviews', populate: { path: 'user', select: 'displayName avatar' } })
            .lean()

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }

        // Lấy sản phẩm liên quan cùng category (hoặc rooms)
        const relatedProducts = await Product.find({
            _id: { $ne: product._id }, // loại trừ sản phẩm hiện tại
            $or: [{ category: product.category?._id }, { rooms: { $in: product.rooms } }],
        })
            .limit(8)
            .lean()

        res.status(200).json({
            product,
            relatedProducts,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getAllBrands = async (req, res) => {
    try {
        const brands = await Product.distinct('brand') // Lấy danh sách brand duy nhất
        res.status(200).json(brands)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateProductById = async (req, res) => {
    // const id = req.params.id
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!product) {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        } else {
            await product.save()
            res.status(200).json(product)
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const searchProduct = async (req, res) => {
    try {
        const query = req.query.q
        // const normalizedQuery = removeAccents(query)
        const normalizedQuery = slugify(query, { lower: true, locale: 'vi' })

        const products = await Product.find({
            slug: { $regex: normalizedQuery, $options: 'i' },
        }).collation({ locale: 'vi', strength: 1 })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        // const normalizedQuery = removeAccents(query)

        const products = await Product.findByIdAndDelete({ _id: id })
        if (!products) {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        } else {
            res.status(200).json({ message: 'Xóa sản phẩm thành công' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const addReview = async (req, res) => {
    try {
        if (req.user && req.user.id) {
            const { slug } = req.params
            const { content, rating } = req.body

            // Kiểm tra xem nội dung và đánh giá có hợp lệ không
            if (!content || !rating) {
                return res.status(400).json({ message: 'Nội dung và đánh giá không thể để trống.' })
            }

            // Kiểm tra rating có trong khoảng từ 1 đến 5 không
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao.' })
            }

            const product = await Product.findOne({ slug }).populate({
                path: 'reviews',
                populate: { path: 'user', select: 'displayName avatar' },
            })

            if (!product) {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' })
            }

            // Tạo review mới
            const review = new Review({
                content,
                rating,
                user: req.user.id,
            })

            // Lưu review vào cơ sở dữ liệu
            await review.save()

            // Thêm review vào mảng reviews của sản phẩm
            product.reviews.push(review)
            await product.save()

            // Lấy thông tin review đã được populate người dùng
            const populatedReview = await review.populate({ path: 'user', select: 'displayName avatar' })

            return res.status(200).json({ review: populatedReview })
        } else {
            return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng.' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getProducts,
    getProductById,
    getProductsByCategoryOrRoom,
    getProductBySlug,
    getAllBrands,
    createProduct,
    updateProductById,
    searchProduct,
    deleteProduct,
    addReview,
}
