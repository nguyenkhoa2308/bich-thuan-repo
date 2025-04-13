import classNames from 'classnames/bind'
import { useContext, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

import styles from './MessageInput.module.scss'
import { ChatContext } from '~/contexts/ChatContext'

const cx = classNames.bind(styles)

function MessageInput() {
    const { sendMessage } = useContext(ChatContext)
    const [text, setText] = useState('')

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

    return (
        <div className={cx('message-input-container')}>
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
    )
}

export default MessageInput
