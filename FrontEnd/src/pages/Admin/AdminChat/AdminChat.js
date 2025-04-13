import classNames from 'classnames/bind'
import { useContext } from 'react'

import styles from './AdminChat.module.scss'
import ChatContainer from './ChatContainer'
import { ChatContext } from '~/contexts/ChatContext'
import UserSidebar from './UserSidebar'
import NoChatSelected from '~/components/NoSelectedUser'

const cx = classNames.bind(styles)

function AdminChat() {
    const { selectedUser } = useContext(ChatContext)
    return (
        <div className={cx('d-flex', 'row', 'bg-white', 'wrapper')}>
            {/* Chat */}
            <div className="col-3">
                <UserSidebar />
            </div>
            <div className="col-9">{!selectedUser ? <NoChatSelected /> : <ChatContainer />}</div>
        </div>
    )
}

export default AdminChat
