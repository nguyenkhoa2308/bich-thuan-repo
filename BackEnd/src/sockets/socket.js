/* eslint-disable no-console */

import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import Message from '~/models/message.model'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:2308'],
    },
})

const userSocketMap = {} // { userId: socketId }

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if (!userId) return

    userSocketMap[userId] = socket.id
    socket.join(userId) // join room riêng userId

    // Nếu là admin (được frontend gửi event joinAdmin), join thêm admin-room
    socket.on('joinAdmin', () => {
        socket.join('admin-room')
    })

    socket.on('markAsRead', async ({ fromUserId, toUserId }) => {
        await Message.updateMany({ senderId: fromUserId, receiverId: toUserId, seen: false }, { $set: { seen: true } })
    })

    // Debug online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('disconnect', () => {
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

// export const getReceiverSocketId = (userId) => userSocketMap[userId]

export { io, app, server }

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}
