import express from 'express'
const router = express.Router()

import { auth, adminMiddleware } from '~/middlewares/auth'
const { getUsersForSidebar, getMessages, sendMessage } = require('../controllers/message.controller')

router.get('/users', auth, adminMiddleware, getUsersForSidebar)
router.get('/:id', auth, getMessages)
router.post('/send/:id', auth, sendMessage)

module.exports = router
