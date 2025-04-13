import { createContext, useState, useEffect, useContext, useCallback } from 'react'
import httpRequest from '~/utils/httpRequest'
import { AuthContext } from '~/contexts/AuthContext'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const { auth, socket } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])

    const getUsers = useCallback(async () => {
        try {
            const res = await httpRequest.get(`/messages/users`)
            // console.log(res)
            setUsers(res)
        } catch (error) {
            console.log(error)
        }
    }, [])

    const getMessages = useCallback(async (userId) => {
        try {
            const res = await httpRequest.get(`/messages/${userId}`)
            setMessages(res)
        } catch (error) {
            console.log(error)
        }
    }, [])

    const sendMessage = async (messageText) => {
        // if (!selectedUser) return
        try {
            let receiverId

            if (auth.user.id === '67df90b43899a512b6e0a47f') {
                if (!selectedUser) return console.log('Chọn khách hàng để nhắn tin!')
                receiverId = selectedUser._id // Admin gửi cho khách hàng
            } else {
                receiverId = '67df90b43899a512b6e0a47f' // Khách hàng luôn gửi cho admin
            }

            // const messageData = {
            //     senderId: auth.user.id,
            //     message: messageText,
            // }
            const res = await httpRequest.post(`/messages/send/${receiverId}`, messageText)
            setMessages((prev) => [...prev, res])
        } catch (error) {
            console.log(error)
        }
    }

    // 🟢 Lắng nghe tin nhắn mới từ WebSocket
    useEffect(() => {
        if (!socket || !auth.user) return

        socket.on('newMessage', (newMessage) => {
            if (auth.user.id === '67df90b43899a512b6e0a47f') {
                // Chỉ cập nhật tin nhắn nếu tin nhắn thuộc về khách hàng đang chọn
                if (selectedUser && newMessage.senderId === selectedUser._id) {
                    setMessages((prevMessages) => [...prevMessages, newMessage])
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessage])
            }
        })

        return () => {
            socket.off('newMessage')
        }
    }, [socket, selectedUser, auth.user])

    return (
        <ChatContext.Provider
            value={{
                users,
                messages,
                selectedUser,
                // isUsersLoading,
                // isMessagesLoading,
                getUsers,
                getMessages,
                sendMessage,
                setSelectedUser,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}
