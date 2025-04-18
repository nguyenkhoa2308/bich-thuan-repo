import classNames from 'classnames/bind'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'

import styles from './ReviewForm.module.scss'
import { AuthContext } from '~/contexts/AuthContext'
import httpRequest from '~/utils/httpRequest'
import images from '~/assets/images'
import Button from '../Button'
import ReactQuill from 'react-quill'

const cx = classNames.bind(styles)

function ReviewForm({ slug, setReviews }) {
    const navigate = useNavigate()
    const { auth } = useContext(AuthContext)

    const [rating, setRating] = useState(0)
    const [content, setContent] = useState('')
    const [showEditor, setShowEditor] = useState(false)
    // const [message, setMessage] = useState('')

    // eslint-disable-next-line
    const handleSubmit = async (e) => {
        // e.preventDefault()
        try {
            const res = await httpRequest.post(`products/${slug}/addReview`, {
                rating,
                content,
            })
            // setMessage('Review submitted!')
            setRating(0)
            setContent('')
            setShowEditor(false)
            setReviews((prevReviews) => [res.review, ...(Array.isArray(prevReviews) ? prevReviews : [])])
        } catch (error) {
            console.log('Error submitting review')
        }
    }

    const handleRating = (rate) => {
        setRating(rate)
        // other logic
    }

    return auth?.isAuthenticated ? (
        <div className={cx('wrapper')}>
            <div className={cx('user-avatar')}>
                <img className={cx('img-avatar')} src={images.defaultAvatar} alt="avatar" />
            </div>
            <div className={cx('feedback-box')}>
                <div className={cx('rating')}>
                    <Rating
                        onClick={handleRating}
                        initialValue={rating}
                        size={25}
                        fillColor="#d0011b"
                        emptyColor="#d1d5db"
                    />
                </div>
                {!showEditor ? (
                    <div className={cx('comment')} onClick={() => setShowEditor(true)}>
                        <div className={cx('comment-placeholder')}>Nhập đánh giá của bạn</div>
                    </div>
                ) : (
                    <div>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            className="mt-3"
                            modules={{
                                toolbar: {
                                    container: [
                                        [{ font: [] }],
                                        [{ size: [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                                        // ['link', 'image', 'video'],
                                        // ['code-block'],
                                        ['clean'],
                                    ],
                                },
                                clipboard: {
                                    matchVisual: false,
                                },
                            }}
                            formats={[
                                'font',
                                'size',
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'blockquote',
                                'list',
                                'bullet',
                                'indent',
                                // 'link',
                                // 'image',
                                // 'video',
                                // 'code-block',
                            ]}
                        />

                        <div className="d-flex justify-content-end">
                            <Button outline className={cx('cancel-btn')} onClick={() => setShowEditor(false)}>
                                Huỷ
                            </Button>
                            <Button primary className={cx('submit-btn')} onClick={() => handleSubmit()}>
                                Gửi đánh giá
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <div>
            <p>Đăng nhập để đánh giá sản phẩm</p>
            <Button primary onClick={() => navigate('/login')}>
                Đăng nhập
            </Button>
        </div>
    )
}

export default ReviewForm
