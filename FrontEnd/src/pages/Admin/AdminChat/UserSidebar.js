import classNames from 'classnames/bind'
import { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'

import styles from './UserSidebar.module.scss'
import Image from '~/components/Image'
import { ChatContext } from '~/contexts/ChatContext'
import { AuthContext } from '~/contexts/AuthContext'
import { SearchIcon } from '~/components/Icons'
import { useDebounce } from '~/hooks'

const cx = classNames.bind(styles)

const UserSidebar = () => {
    const { auth, socket } = useContext(AuthContext)
    const { getUsers, users, selectedUser, setSelectedUser } = useContext(ChatContext)

    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        getUsers() // Gọi API khi component mount
    }, [getUsers]) // Chỉ chạy lại nếu getUsers thay đổi, nhưng bây giờ nó đã được memo hóa

    function formatMessageTime(timestamp) {
        const now = dayjs()
        const sent = dayjs(timestamp)
        const diffMinutes = now.diff(sent, 'minute')
        const diffHours = now.diff(sent, 'hour')
        const diffDays = now.diff(sent, 'day')
        const diffWeeks = now.diff(sent, 'week')
        const diffMonths = now.diff(sent, 'month')
        const diffYears = now.diff(sent, 'year')

        if (diffMinutes < 1) return 'vừa xong'
        if (diffMinutes < 60) return `${diffMinutes} phút trước`
        if (diffHours < 24) return `${diffHours} giờ trước`
        if (diffDays < 7) return `${diffDays} ngày trước`
        if (diffWeeks < 4) return `${diffWeeks} tuần trước`
        if (diffMonths < 12) return `${diffMonths} tháng trước`
        return `${diffYears} năm trước`
    }

    const handleSelect = (user) => {
        setSelectedUser(user)
        socket.emit('markAsRead', {
            fromUserId: user.user._id,
            toUserId: auth.user.id,
        })
        getUsers()
    }

    const handleChange = (e) => {
        const value = e.target.value
        if (!value.startsWith(' ')) {
            setSearchValue(value)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            // handleSearch()
            console.log('Hello')
        }
    }

    const debouncedValue = useDebounce(searchValue, 500)

    const filteredUsers = users.filter((item) =>
        item.user.displayName?.toLowerCase().includes(debouncedValue.toLowerCase()),
    )

    const truncateText = (text, maxLength) => {
        if (!text) return ''
        return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
    }

    return (
        <aside className="h-100 w-100 border-end d-flex flex-column">
            <div className="border-bottom w-100 p-4">
                <div className="d-flex align-items-center gap-2">
                    <span className={cx('heading')}>Đoạn chat</span>
                </div>
                <div className={cx('search-container', 'd-flex')}>
                    <span className={cx('search-icon')}>
                        <SearchIcon />
                    </span>
                    <input
                        className={cx('search-input')}
                        placeholder="Tìm kiếm đoạn chat..."
                        value={searchValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>
            </div>

            <div className="overflow-auto w-100 py-3">
                {filteredUsers.map((user, index) => (
                    <div key={index} onClick={() => handleSelect(user)} className={cx('w-100')}>
                        <div
                            className={cx('p-3', 'd-flex', 'align-items-center', 'gap-3', 'mx-3', 'user-container', {
                                selected: user.user._id === selectedUser?.user._id,
                            })}
                        >
                            <div className={cx('avatar-container')}>
                                {users.includes(user._id) && (
                                    <span
                                        className="position-absolute bottom-0 end-0 size-3 bg-success
                            rounded-circle ring-2 ring-dark"
                                    />
                                )}
                                <Image src={user.user.avatar} className={cx('user-avatar')} />
                            </div>

                            {/* User info - only visible on larger screens */}
                            <div className="d-none d-lg-block text-left flex-grow-1">
                                <div className={cx('username')}>{user.user.displayName}</div>
                                <div className={cx('last-message')}>
                                    <span className={cx({ 'unread-message': user.unreadCount > 0 })}>
                                        {user.lastMessage?.senderId === auth.user.id ? 'Bạn:' : ''}{' '}
                                        <span>{truncateText(user.lastMessage?.text, 15)}</span>
                                    </span>
                                    <span className={cx('dot')}> · </span>
                                    <span className={cx('message-time')}>
                                        {formatMessageTime(user.lastMessage?.createdAt)}
                                    </span>
                                </div>
                            </div>
                            {user.unreadCount > 0 && (
                                <div className={cx('unread-count')}>
                                    {user.unreadCount > 9 ? (
                                        <span className={cx('text')}>9+</span>
                                    ) : (
                                        <span className={cx('text')}>{user.unreadCount}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}
export default UserSidebar
