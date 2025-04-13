import classNames from 'classnames/bind'
import { useContext, useEffect, useRef, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'

import styles from './ChatContainer.module.scss'
import { AuthContext } from '~/contexts/AuthContext'
import { ChatContext } from '~/contexts/ChatContext'
import Image from '~/components/Image'
import MessageInput from '~/components/MessageInput'
import images from '~/assets/images'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

const cx = classNames.bind(styles)

const ChatContainer = () => {
    const { messages, getMessages, selectedUser, setSelectedUser } = useContext(ChatContext)
    const { auth } = useContext(AuthContext)

    const containerRef = useRef(null)
    const messageEndRef = useRef(null)

    const [initialLoad, setInitialLoad] = useState(true)
    const [isAtBottom, setIsAtBottom] = useState(true)
    const [shouldRenderGoDownBtn, setShouldRenderGoDownBtn] = useState(false)

    useEffect(() => {
        getMessages(selectedUser._id)
        // subscribeToMessages()

        // return () => unsubscribeFromMessages()
    }, [selectedUser._id, getMessages])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const threshold = 100
            const isBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold
            setIsAtBottom(isBottom)
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: initialLoad ? 'auto' : 'smooth',
            })
            setInitialLoad(false) // chỉ chạy 'auto' một lần duy nhất khi mở cuộc trò chuyện
        }
    }, [initialLoad, messages])

    useEffect(() => {
        setShouldRenderGoDownBtn(!isAtBottom)
    }, [isAtBottom])

    const formatMessageTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    }

    // if (isMessagesLoading) {
    //     return (
    //         <div className="flex-1 flex flex-col overflow-auto">
    //             {/* <ChatHeader /> */}
    //             <MessageInput />
    //         </div>
    //     )
    // }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('chat-header', 'd-flex', 'justify-content-between', 'align-items-center')}>
                <div className={cx('header-info', 'd-flex')}>
                    <div className={cx('user-avatar')}>
                        {/* <Image src={selectedUser.profilePic} className={cx('avatar-image')}></Image> */}
                        <Image src={images.defaultAvatar} className={cx('avatar-image')}></Image>
                    </div>
                    <div className={cx('user-info', 'd-flex', 'flex-column', 'justify-content-center')}>
                        <h3 className={cx('user-name')}>{selectedUser.displayName}</h3>
                    </div>
                </div>
                <div className={cx('close-button')} onClick={() => setSelectedUser(null)}>
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
                                        <Image src={images.defaultAvatar} className={cx('avatar-image')}></Image>
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

                <button
                    onClick={() => {
                        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={cx('go-down-btn', {
                        visible: shouldRenderGoDownBtn,
                        exit: !shouldRenderGoDownBtn,
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
