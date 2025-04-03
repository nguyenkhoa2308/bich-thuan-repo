import classNames from 'classnames/bind'
import { useContext, useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faMessage, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

import styles from './CustomerChat.module.scss'
// import Button from '~/components/Button'
import Image from '~/components/Image'
import images from '~/assets/images'
import { ChatContext } from '~/contexts/ChatContext'
import { AuthContext } from '~/contexts/AuthContext'

const cx = classNames.bind(styles)

function CustomerChat() {
    const {
        messages,
        sendMessage,
        getMessages,
        // isMessagesLoading,
        // selectedUser,
        // subscribeToMessages,
        // unsubscribeFromMessages,
    } = useContext(ChatContext)
    const { auth } = useContext(AuthContext)

    const messageEndRef = useRef(null)
    const [showChat, setShowChat] = useState(false)
    const [text, setText] = useState('')

    useEffect(() => {
        getMessages('67df90b43899a512b6e0a47f')

        // subscribeToMessages()

        // return () => unsubscribeFromMessages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth?.user?.id])

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (!text.trim()) return

        try {
            await sendMessage({
                text: text.trim(),
            })
            setText('')
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    const formatMessageTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

    return (
        <div className={cx('customer-chat', { 'show-chat': showChat })}>
            {/* <h2>Customer Chat</h2> */}
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
                            <Image src={images.chatAvatar} className={cx('avatar-image')}></Image>
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
                <div className={cx('chat-body')}>
                    <div className={cx('message', 'admin-message')}>
                        <div className={cx('admin-avatar')}>
                            <Image src={images.chatAvatar} className={cx('avatar-image')}></Image>
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
                                    <div className="size-10 rounded-full border">
                                        <img src={images.chatAvatar} alt="profile pic" />
                                    </div>
                                </div>
                            )}

                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
                            </div>
                            <div className="chat-bubble flex flex-col">
                                {/* {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )} */}
                                {message.text && <p className={cx('message-text')}>{message.text}</p>}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={cx('chat-footer')}>
                    <form className={cx('chat-form')} onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn của bạn..."
                            required
                            className={cx('message-input')}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        {/* <FontAwesomeIcon icon= */}
                    </form>
                    <button
                        type="submit"
                        className={cx('send-btn')}
                        disabled={!text.trim()}
                        onClick={(e) => handleSendMessage(e)}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} className={cx('send-icon')} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CustomerChat
