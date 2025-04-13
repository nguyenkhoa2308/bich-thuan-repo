import { useContext, useEffect, useState } from 'react'
// import SidebarSkeleton from './skeletons/SidebarSkeleton'
import { Users } from 'lucide-react'
import { ChatContext } from '~/contexts/ChatContext'
import Avatar from 'react-avatar'

const UserSidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser } = useContext(ChatContext)

    // const { onlineUsers } = useContext()
    const [userColors, setUserColors] = useState({})
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    useEffect(() => {
        getUsers() // Gọi API khi component mount
    }, [getUsers]) // Chỉ chạy lại nếu getUsers thay đổi, nhưng bây giờ nó đã được memo hóa

    useEffect(() => {
        const storedColors = JSON.parse(localStorage.getItem('userColors')) || {}
        const colors = { ...storedColors }

        users.forEach((user) => {
            if (!colors[user._id]) {
                colors[user._id] = getRandomColor()
            }
        })

        setUserColors(colors)
        localStorage.setItem('userColors', JSON.stringify(colors))
    }, [users])

    // const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users

    // if (isUsersLoading) return <SidebarSkeleton />

    return (
        <aside className="h-100 w-100 border-end border-base-300 d-flex flex-column">
            <div className="border-bottom border-base-300 w-100 p-4">
                <div className="d-flex align-items-center gap-2">
                    <Users className="fs-1" />
                    <span className="fw-medium d-none d-lg-block">Contacts</span>
                </div>
                {/* TODO: Online filter toggle */}
                <div className="mt-3 d-none d-lg-flex align-items-center gap-2">
                    <label className="cursor-pointer d-flex align-items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="form-check-input"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-muted">({users.length - 1} online)</span>
                </div>
            </div>

            <div className="overflow-auto w-100 py-3">
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-100 p-3 d-flex align-items-center gap-3 hover:bg-base-300 transition-colors ${
                            selectedUser?._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''
                        }`}
                    >
                        <div className="relative lg:mx-0">
                            {/* Sử dụng Avatar với màu sắc đã lưu */}
                            {users.includes(user._id) && (
                                <span
                                    className="position-absolute bottom-0 end-0 size-3 bg-success
                            rounded-circle ring-2 ring-dark"
                                />
                            )}
                            <Avatar color={userColors[user._id]} name={user.displayName} size="40" round={true} />
                        </div>

                        {/* User info - only visible on larger screens */}
                        <div className="d-none d-lg-block text-left">
                            <div className="fw-medium text-truncate">{user.displayName}</div>
                            <div className="text-sm text-muted">{users.includes(user._id) ? 'Online' : 'Offline'}</div>
                        </div>
                    </div>
                ))}

                {users.length === 0 && <div className="text-center text-muted py-4">No online users</div>}
            </div>
        </aside>
    )
}
export default UserSidebar
