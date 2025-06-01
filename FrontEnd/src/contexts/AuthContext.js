import { createContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'

import httpRequest from '~/utils/httpRequest'

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: '',
        email: '',
        name: '',
        role: '',
        avatar: '',
    },
    socket: null,
})

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            id: '',
            email: '',
            name: '',
            role: '',
            avatar: '',
        },
    })
    const [socket, setSocket] = useState(null)
    const [loading, setLoading] = useState(true) // 🔥 Thêm biến loading

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem('access_token')
            if (!token) {
                setAuth({ isAuthenticated: false, user: null })
                setLoading(false) // ✅ Đánh dấu đã load xong
                return
            }

            try {
                const res = await httpRequest.get(`user/account`)
                if (res && !res.message) {
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            id: res.id,
                            email: res.email,
                            name: res.name,
                            role: res.role,
                            avatar: res.avatar,
                        },
                    })
                } else {
                    setAuth({ isAuthenticated: false, user: null })
                }
            } catch (error) {
                setAuth({ isAuthenticated: false, user: null })
            }
            setLoading(false) // ✅ Đánh dấu đã load xong
        }

        fetchAccount()
    }, [])

    useEffect(() => {
        if (auth.isAuthenticated && auth.user) {
            const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
                query: { userId: auth.user.id },
            })

            newSocket.on('connect', () => {
                if (auth.user.role === 'admin') {
                    newSocket.emit('joinAdmin')
                }
            })

            setSocket(newSocket)

            return () => newSocket.disconnect()
        }
    }, [auth.isAuthenticated, auth.user])

    return <AuthContext.Provider value={{ auth, loading, socket, setAuth }}>{children}</AuthContext.Provider>
}
