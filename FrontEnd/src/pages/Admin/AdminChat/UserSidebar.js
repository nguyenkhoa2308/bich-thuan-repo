import classNames from 'classnames/bind'
import { useContext, useEffect, useState } from 'react'
// import SidebarSkeleton from './skeletons/SidebarSkeleton'
import { Users } from 'lucide-react'

import styles from './UserSidebar.module.scss'
import Image from '~/components/Image'
import { ChatContext } from '~/contexts/ChatContext'

const cx = classNames.bind(styles)

const UserSidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser } = useContext(ChatContext)

    // const { onlineUsers } = useContext()
    const [showOnlineOnly, setShowOnlineOnly] = useState(false)

    useEffect(() => {
        getUsers() // Gọi API khi component mount
    }, [getUsers]) // Chỉ chạy lại nếu getUsers thay đổi, nhưng bây giờ nó đã được memo hóa

    // const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users

    // if (isUsersLoading) return <SidebarSkeleton />

    console.log(selectedUser)

    return (
        <aside className="h-100 w-100 border-end d-flex flex-column">
            <div className="border-bottom w-100 p-4">
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
                    <div key={user._id} onClick={() => setSelectedUser(user)} className={cx('w-100')}>
                        <div
                            className={cx('p-3', 'd-flex', 'align-items-center', 'gap-3', 'mx-3', 'user-container', {
                                selected: user._id === selectedUser?._id,
                            })}
                        >
                            <div className={cx('avatar-container')}>
                                {users.includes(user._id) && (
                                    <span
                                        className="position-absolute bottom-0 end-0 size-3 bg-success
                            rounded-circle ring-2 ring-dark"
                                    />
                                )}
                                <Image src={user.avatar} className={cx('user-avatar')} />
                            </div>

                            {/* User info - only visible on larger screens */}
                            <div className="d-none d-lg-block text-left">
                                <div className="fw-medium text-truncate">{user.displayName}</div>
                                {/* <div className="text-sm text-muted">
                                    {users.includes(user._id) ? 'Online' : 'Offline'}
                                </div> */}
                            </div>
                        </div>
                    </div>
                ))}

                {users.length === 0 && <div className="text-center text-muted py-4">No online users</div>}
            </div>
        </aside>
    )
}
export default UserSidebar
