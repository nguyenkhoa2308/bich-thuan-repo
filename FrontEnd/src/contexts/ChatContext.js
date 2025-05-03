import { createContext, useState, useEffect, useContext, useCallback } from 'react'
import httpRequest from '~/utils/httpRequest'
import { AuthContext } from '~/contexts/AuthContext'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const { auth, socket } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [messages, setMessages] = useState([])

    const isAdmin = auth?.user?.id === '67df90b43899a512b6e0a47f'

    const getUsers = useCallback(async () => {
        try {
            const res = await httpRequest.get(`/messages/users`)
            setUsers(res)
        } catch (error) {
            console.error('getUsers error:', error)
        }
    }, [])

    const getMessages = useCallback(async (userId) => {
        try {
            const res = await httpRequest.get(`/messages/${userId}`)
            setMessages(res)
        } catch (error) {
            console.error('getMessages error:', error)
        }
    }, [])

    const sendMessage = async (messageText) => {
        try {
            const receiverId = isAdmin ? selectedUser?.user._id : '67df90b43899a512b6e0a47f'

            if (!receiverId) return console.warn('Người nhận không xác định!')

            await httpRequest.post(`/messages/send/${receiverId}`, messageText)
            // setMessages((prev) => [...prev, res])
        } catch (error) {
            console.error('sendMessage error:', error)
        }
    }

    useEffect(() => {
        if (!socket || !auth.user) return

        socket.on('newMessage', (newMessage) => {
            const isChatOpen = selectedUser && newMessage.senderId === selectedUser.user._id

            // ✅ Cập nhật tin nhắn nếu đang chat với người đó
            if (isChatOpen) {
                setMessages((prev) => [...prev, newMessage])

                // ✅ Gửi sự kiện markAsRead nếu đang mở
                socket.emit('markAsRead', {
                    fromUserId: newMessage.senderId,
                    toUserId: auth.user.id,
                })
            } else {
                // Nếu không mở, vẫn nhận tin nhắn nhưng sẽ tính là chưa đọc
                setMessages((prev) => [...prev, newMessage])
            }

            // Cập nhật lại users
            setUsers((prevUsers) => {
                const userExists = prevUsers.some(
                    (item) => item.user._id === newMessage.senderId || item.user._id === newMessage.receiverId,
                )

                if (!userExists) {
                    getUsers()
                    return prevUsers
                }

                // Cập nhật từng user
                const updatedUsers = prevUsers.map((item) => {
                    const userId = item.user._id
                    const isFromUser = newMessage.senderId === userId
                    const isToUser = newMessage.receiverId === userId

                    if (!isFromUser && !isToUser) return item

                    const isUnread = isFromUser && !isChatOpen

                    return {
                        ...item,
                        lastMessage: newMessage,
                        unreadCount: isUnread ? item.unreadCount + 1 : item.unreadCount,
                    }
                })

                // ✅ Sort lại theo thời gian gửi tin mới nhất
                return updatedUsers.sort(
                    (a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt),
                )
            })
        })

        return () => {
            socket.off('newMessage')
        }
    }, [socket, selectedUser, auth.user, getUsers])

    return (
        <ChatContext.Provider
            value={{
                users,
                messages,
                selectedUser,
                setMessages,
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
