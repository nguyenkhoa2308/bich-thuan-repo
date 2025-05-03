import User from '~/models/user.model'
import Message from '~/models/message.model'
import { getReceiverSocketId, io } from '~/sockets/socket'

export const getUsersForSidebar = async (req, res) => {
    const adminId = req.user.id

    try {
        const messages = await Message.find({
            $or: [{ senderId: adminId }, { receiverId: adminId }],
        }).sort({ createdAt: -1 })

        const map = new Map()

        messages.forEach((msg) => {
            const otherUserId =
                msg.senderId.toString() === adminId ? msg.receiverId.toString() : msg.senderId.toString()

            if (!map.has(otherUserId)) {
                map.set(otherUserId, {
                    userId: otherUserId,
                    lastMessage: msg,
                    unreadCount: 0,
                })
            }

            if (msg.senderId.toString() === otherUserId && msg.receiverId.toString() === adminId && !msg.seen) {
                map.get(otherUserId).unreadCount++
            }
        })

        const userIds = [...map.keys()]
        const users = await User.find({ _id: { $in: userIds } }).select('_id displayName avatar')

        const results = users.map((user) => ({
            user,
            lastMessage: map.get(user._id.toString()).lastMessage,
            unreadCount: map.get(user._id.toString()).unreadCount,
        }))

        // 🔄 Sắp xếp theo thời gian gửi mới nhất
        results.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt))

        res.status(200).json(results)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get conversations' })
    }
}

const getMessages = async (req, res) => {
    try {
        if (!req.user.id) {
            return res.status(401).json({ message: 'Người dùng cần đăng nhập' })
        }

        const { id: userToChatId } = req.params
        const myId = req.user.id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        })

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const sendMessage = async (req, res) => {
    try {
        if (!req.user.id) {
            return res.status(401).json({ message: 'Người dùng cần đăng nhập' })
        }

        const { text } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user.id

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
        })

        await newMessage.save()

        const senderSocketId = getReceiverSocketId(senderId)
        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit('newMessage', newMessage) // ✅ Emit lại cho người gửi
        }

        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' })
    }
}

module.exports = {
    getUsersForSidebar,
    getMessages,
    sendMessage,
}
