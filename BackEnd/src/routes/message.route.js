import express from 'express'

import { auth, adminMiddleware } from '~/middlewares/auth'
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller'

const router = express.Router()

router.get('/users', auth, adminMiddleware, getUsersForSidebar)
router.get('/:id', auth, getMessages)
router.post('/send/:id', auth, sendMessage)

module.exports = router
