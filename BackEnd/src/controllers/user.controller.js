// import mongoose from 'mongoose'
require('dotenv').config()
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

import { createUserService, getUserService, loginService, getUserByIdService } from '~/services/userService'
import User from '~/models/user.model'
import sendEmail from '~/utils/sendEmail'
import cloudinary from '~/utils/cloudinary'

const saltRound = 10
const DEFAULT_USER_AVATAR = 'https://res.cloudinary.com/dezywk7nm/image/upload/v1743777314/default-avatar_stq3ir.jpg'

const createUser = async (req, res) => {
    const { email, password, firstName, lastName, displayName, gender, birthDate } = req.body
    const data = await createUserService(email, password, firstName, lastName, displayName, gender, birthDate)
    return res.status(200).json(data)
}

const login = async (req, res) => {
    const { email, password } = req.body
    const data = await loginService(email, password)
    return res.status(200).json(data)
}

const getUser = async (req, res) => {
    const data = await getUserService()
    return res.status(200).json(data)
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user)
}

const getUserById = async (req, res) => {
    const id = req.params.id
    const data = await getUserByIdService(id)
    return res.status(200).json(data)
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email: email }).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 900000 // 15 phút
        await user.save()

        const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`
        await sendEmail(user.email, '[NinFurniture] Đặt lại mật khẩu', `${resetUrl}`)

        res.json({ message: 'Email đặt lại mật khẩu đã được gửi', status: 200 })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })

        if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })

        const isMatchPassword = await bcrypt.compare(newPassword, user.password)

        if (isMatchPassword) {
            return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ' })
        }

        // Cập nhật mật khẩu mới
        const hashPassword = await bcrypt.hash(newPassword, saltRound)

        user.password = hashPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        res.json({ message: 'Mật khẩu đã được đặt lại', status: 200 })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' })
    }
}

const changePassword = async (req, res) => {
    try {
        if (!req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const { newPassword } = req.body

        const user = await User.findOne({ _id: req.user.id })

        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })

        const isMatchPassword = await bcrypt.compare(newPassword, user.password)

        if (isMatchPassword) {
            return res.status(400).json({ message: 'Mật khẩu mới không được giống mật khẩu cũ' })
        }

        // Cập nhật mật khẩu mới
        const hashPassword = await bcrypt.hash(newPassword, saltRound)

        user.password = hashPassword
        await user.save()

        res.json({ message: 'Mật khẩu đã được đặt lại', status: 200 })
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' })
    }
}

const verifyPassword = async (req, res) => {
    try {
        if (req.user.id) {
            const { password } = req.body

            const user = await User.findOne({ _id: req.user.id })

            if (!user) return res.status(404).json({ message: 'User không tồn tại' })

            const isMatchPassword = await bcrypt.compare(password, user.password)

            if (!isMatchPassword) {
                return res.status(400).json({ message: 'Mật khẩu không đúng' })
            }

            return res.json({ message: 'Xác minh thành công', status: 200 })
        } else {
            return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        if (req.user.id) {
            const { firstName, lastName, displayName, gender, birthDate } = req.body
            const avatar = req.file

            const user = await User.findById(req.user.id).select('-password')

            if (avatar) {
                if (user.avatar && user.avatar !== DEFAULT_USER_AVATAR) {
                    const publicId = user.avatar.split('/').pop().split('.')[0]
                    await cloudinary.uploader.destroy(`avatars/${publicId}`)
                }
                user.avatar = req.file.path // Lấy URL từ ảnh đã upload lên Cloudinary
            }

            user.firstName = firstName
            user.lastName = lastName
            user.displayName = displayName
            user.gender = gender
            user.birthDate = birthDate

            await user.save()

            const payload = {
                id: user._id,
                email: user.email,
                name: user.displayName,
                role: user.role,
            }

            const access_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })

            return res.status(200).json({ user, access_token, EC: 0 })
        } else {
            return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateRole = async (req, res) => {
    try {
        const userId = req.params.id
        if (req.user.id === userId) {
            return res.status(403).json({ message: 'Bạn không thể tự chỉnh sửa vai trò của chính mình' })
        }

        if (userId) {
            const { role } = req.body
            const updateUser = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $set: {
                        role: role,
                    },
                },
                { new: true },
            )

            return res.status(200).json({ updateUser, EC: 0 })
        } else {
            return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteAccount = async (req, res) => {
    try {
        const userId = req.params.id

        const deleteUser = await User.findOneAndDelete({ _id: userId })
        return res.status(200).json({ deleteUser, status: 200 })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const addWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const productId = req.params.productId

        const isLiked = user.wishlists.includes(productId)

        if (user.wishlists.includes(productId)) {
            user.wishlists.pull(productId)
        } else {
            user.wishlists.push(productId)
        }

        await user.save()
        return res.status(200).json({ status: 200, isLiked: isLiked })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getWishlists = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlists')
        return res.status(200).json({ wishlists: user.wishlists })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    createUser,
    login,
    getUser,
    getAccount,
    getUserById,
    updateUser,
    updateRole,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyPassword,
    deleteAccount,
    getWishlists,
    addWishlist,
}
