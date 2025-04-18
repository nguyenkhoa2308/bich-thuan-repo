import classNames from 'classnames/bind'
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faMessage, faXmark } from '@fortawesome/free-solid-svg-icons'

import styles from './CustomerChat.module.scss'
import Image from '~/components/Image'
import images from '~/assets/images'
import MessageInput from '~/components/MessageInput'
import Button from '~/components/Button'
import { ChatContext } from '~/contexts/ChatContext'
import { AuthContext } from '~/contexts/AuthContext'

const cx = classNames.bind(styles)

function CustomerChat() {
    const navigate = useNavigate()
    const { messages, getMessages } = useContext(ChatContext)
    const { auth } = useContext(AuthContext)

    const messageEndRef = useRef(null)
    const [showChat, setShowChat] = useState(false)

    useEffect(() => {
        if (auth?.isAuthenticated) {
            getMessages('67df90b43899a512b6e0a47f')
        }
    }, [auth?.isAuthenticated, getMessages])

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, showChat])

    const formatMessageTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

    const handleLogin = () => {
        navigate('/login')
        setShowChat(false)
    }

    return (
        <div className={cx('customer-chat', { 'show-chat': showChat })}>
            <div className={cx('chat-toggler')} onClick={() => setShowChat((prev) => !prev)}>
                <span>
                    <FontAwesomeIcon icon={faMessage} />
                </span>
                <span>
                    <FontAwesomeIcon icon={faXmark} />
                </span>
            </div>
            <div className={cx('chat-popup')}>
                <div className={cx('chat-header')}>
                    <div className={cx('header-info')}>
                        <div className={cx('admin-avatar')}>
                            <Image src={images.chatAvatar} className={cx('avatar-image')} />
                        </div>
                        <div className={cx('info-title')}>
                            Admin - CSKH
                            <div className={cx('info-description')}>Chúng tôi sẵn sàng trợ giúp phản hồi của bạn!</div>
                        </div>
                    </div>
                    <div className={cx('header-action')} onClick={() => setShowChat(false)}>
                        <FontAwesomeIcon icon={faAngleDown} className={cx('close-chat')} />
                    </div>
                </div>

                {/* Overlay blur */}
                {!auth?.isAuthenticated && <div className={cx('overlay')} />}

                {/* Chat Body */}
                <div className={cx('chat-body', { blur: !auth?.isAuthenticated })}>
                    <div className={cx('message', 'admin-message')}>
                        <div className={cx('admin-avatar')}>
                            <Image src={images.chatAvatar} className={cx('avatar-image')} />
                        </div>
                        <p className={cx('message-text')}>Xin chào! Bạn cần hỗ trợ gì hôm nay?</p>
                    </div>
                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className={cx('message', {
                                'admin-message': message.senderId !== auth.user.id,
                                'user-message': message.senderId === auth.user.id,
                            })}
                            ref={messageEndRef}
                        >
                            {message.senderId !== auth.user.id && (
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full">
                                        <Image src={images.chatAvatar} className={cx('avatar-image')} />
                                    </div>
                                </div>
                            )}

                            <div className={cx('message-content')}>
                                <div className={cx('time')}>
                                    <time className="text-xs opacity-50 ml-1">
                                        {formatMessageTime(message.createdAt)}
                                    </time>
                                </div>
                                <div className="chat-bubble flex flex-col">
                                    {message.text && <p className={cx('message-text')}>{message.text}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Login Button in Center */}
                {!auth?.isAuthenticated && (
                    <div className={cx('centered-login')}>
                        <Button primary onClick={() => handleLogin()}>
                            Đăng nhập
                        </Button>
                    </div>
                )}

                {/* Input box */}
                <div className={cx('chat-footer')}>
                    <MessageInput />
                </div>
            </div>
        </div>
    )
}

export default CustomerChat
