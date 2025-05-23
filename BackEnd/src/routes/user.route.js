const express = require('express')
const router = express.Router()
import { auth, adminMiddleware } from '~/middlewares/auth'
import upload from '~/middlewares/upload'

import {
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
} from '~/controllers/user.controller'

// const { getCart, addToCart } = require('~/controllers/user.controller')

// const { verifyToken } = require('../middleware/authJwt')

router.post('/register', createUser)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/verify', auth, verifyPassword)
router.post('/wishlists/:productId', auth, addWishlist)

router.get('/', getUser)
router.get('/getUserById/:id', getUserById)
router.get('/account', auth, getAccount)
router.get('/wishlists', auth, getWishlists)

router.put('/change-password', auth, changePassword)
router.put('/update', auth, upload.single('avatar'), updateUser)
router.put('/updateRole/:id', auth, adminMiddleware, updateRole)
router.delete('/:id', auth, adminMiddleware, deleteAccount)

module.exports = router
