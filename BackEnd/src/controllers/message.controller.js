import User from '~/models/user.model'
import Message from '~/models/message.model'
import { getReceiverSocketId, io } from '~/sockets/socket'

export const getUsersForSidebar = async (req, res) => {
    try {
        const adminId = req.user.id // ID admin từ token đăng nhập

        // Tìm các tin nhắn liên quan đến admin (admin là sender hoặc receiver)
        const messages = await Message.find({
            $or: [{ sender: adminId }, { receiver: adminId }],
        }).select('sender receiver')

        // Lấy danh sách userId từ tin nhắn, bỏ trùng và bỏ adminId
        const userIds = [
            ...new Set(messages.flatMap((msg) => [msg.sender.toString(), msg.receiver.toString()])),
        ].filter((id) => id !== adminId.toString())

        // Lấy thông tin user từ danh sách userId
        const users = await User.find({ _id: { $in: userIds } }).select('-password')

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
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

        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
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
