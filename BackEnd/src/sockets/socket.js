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

// used to store online users
const userSocketMap = {} // {userId: socketId}

io.on('connection', (socket) => {
    // console.log('A user connected', socket.id)

    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id

    // io.emit() is used to send events to all the connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on('markAsRead', async ({ fromUserId, toUserId }) => {
        await Message.updateMany({ senderId: fromUserId, receiverId: toUserId, seen: false }, { $set: { seen: true } })
    })

    socket.on('disconnect', () => {
        // console.log('A user disconnected', socket.id)
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

export { io, app, server }

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}
