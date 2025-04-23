import classNames from 'classnames/bind'
import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

import styles from './ChatContainer.module.scss'
import { AuthContext } from '~/contexts/AuthContext'
import { ChatContext } from '~/contexts/ChatContext'
import Image from '~/components/Image'
import MessageInput from '~/components/MessageInput'

const cx = classNames.bind(styles)

const ChatContainer = () => {
    const { messages, setMessages, getMessages, selectedUser, setSelectedUser } = useContext(ChatContext)
    const { auth } = useContext(AuthContext)

    const containerRef = useRef(null)
    const messageEndRef = useRef(null)

    const [isAtBottom, setIsAtBottom] = useState(true)

    const scrollToBottom = useCallback(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    const handleScroll = useCallback(() => {
        const container = containerRef.current
        if (!container) return

        const threshold = 100
        const isBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
        setIsAtBottom(isBottom)
    }, [])

    const handleCloseChat = () => {
        setSelectedUser(null)
        setMessages([])
    }

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id)
        }
    }, [selectedUser?._id, getMessages])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    useEffect(() => {
        if (isAtBottom && messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'auto' })
        }
    }, [messages, isAtBottom])

    const formatMessageTime = (date) =>
        new Date(date).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        })

    return (
        <div className={cx('wrapper')}>
            <div className={cx('chat-header', 'd-flex', 'justify-content-between', 'align-items-center')}>
                <div className={cx('header-info', 'd-flex')}>
                    <div className={cx('user-avatar')}>
                        <Image src={selectedUser.avatar} className={cx('avatar-image')} />
                    </div>
                    <div className={cx('user-info', 'd-flex', 'flex-column', 'justify-content-center')}>
                        <h3 className={cx('user-name')}>{selectedUser.displayName}</h3>
                    </div>
                </div>
                <div className={cx('close-button')} onClick={() => handleCloseChat()}>
                    <FontAwesomeIcon icon={faCircleXmark} className={cx('close-icon')} />
                </div>
            </div>

            <div className="position-relative">
                <div className={cx('chat-body')} ref={containerRef}>
                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className={cx('message', {
                                'chat-start': message.senderId !== auth.user.id,
                                'chat-end': message.senderId === auth.user.id,
                            })}
                            ref={messageEndRef}
                        >
                            {message.senderId !== auth.user.id && (
                                <div className="chat-image avatar">
                                    <div className="avt">
                                        <Image src={selectedUser.avatar} className={cx('avatar-image')} />
                                    </div>
                                </div>
                            )}

                            <div className={cx('message-block')}>
                                <span className={cx('time')}>
                                    <time className="text-xs opacity-50">{formatMessageTime(message.createdAt)}</time>
                                </span>

                                <div className={cx('message-content')}>
                                    {message.text && (
                                        <div className="chat-bubble d-flex flex-column">
                                            <div className={cx('message-text')}>{message.text}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={scrollToBottom}
                    className={cx('go-down-btn', {
                        visible: !isAtBottom,
                        exit: isAtBottom,
                    })}
                >
                    <FontAwesomeIcon icon={faArrowDown} />
                </button>
            </div>

            <div className={cx('chat-footer', 'position-relative')}>
                <MessageInput />
            </div>
        </div>
    )
}

export default ChatContainer
