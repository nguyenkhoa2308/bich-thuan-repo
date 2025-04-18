import classNames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import DOMPurify from 'dompurify'

import styles from './ReviewList.module.scss'
import images from '~/assets/images'
import Image from '../Image'
import CustomPagination from '../CustomPagination'

const cx = classNames.bind(styles)
function ReviewList({ reviews }) {
    // Đảm bảo reviews luôn là mảng
    const reviewList = Array.isArray(reviews) ? reviews : []
    const [currentPage, setCurrentPage] = useState(1)
    const commentListRef = useRef(null)
    const reviewsPerPage = 5

    // Khởi tạo biến đếm số sao
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let totalRating = 0

    reviewList.forEach((r) => {
        const star = r.rating
        if (ratingCounts[star] !== undefined) {
            ratingCounts[star]++
        }
        totalRating += star
    })

    const totalVotes = reviewList.length
    const averageRating = totalVotes ? (totalRating / totalVotes).toFixed(1) : 0

    let sortedReviews = []

    if (reviewList.length !== 0) {
        sortedReviews = [...reviewList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Tính index bắt đầu và kết thúc
    const indexOfLastReview = currentPage * reviewsPerPage
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage

    // Cắt danh sách review theo trang
    const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview)
    const totalPages = Math.ceil(totalVotes / reviewsPerPage)

    useEffect(() => {
        if (commentListRef.current) {
            commentListRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [currentPage])

    return (
        <div className={cx('wrapper')}>
            <div className={cx('reviews-list')}>
                <div className={cx('rating-overview')}>
                    <div className={cx('average-rating', 'd-flex')}>
                        <div className={cx('d-flex', 'flex-column', 'justify-content-center')}>
                            <div className={cx('rating-number', 'text-center')}>
                                <span className={cx('rating-score')}>{averageRating}</span>
                                <span className={cx('rating-score-out-of')}> trên 5</span>
                            </div>
                            <Rating
                                readonly
                                initialValue={Number(averageRating)}
                                allowFraction
                                size={25}
                                fillColor="#d0011b"
                                emptyColor="#d1d5db"
                            />
                        </div>
                        <div className={cx('rating-bars')}>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = ratingCounts[star]
                                const percent = totalVotes ? (count / totalVotes) * 100 : 0

                                return (
                                    <div key={star} className={cx('rating-row')}>
                                        <Rating
                                            readonly
                                            initialValue={star}
                                            allowFraction
                                            size={20}
                                            fillColor="#d0011b"
                                            emptyColor="#d1d5db"
                                        />
                                        <div className={cx('bar-wrapper')}>
                                            <div className={cx('bar-fill')} style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <span className={cx('vote-count')}>{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {reviewList.length === 0 ? (
                    <div className={cx('ratings-comment__no-data')}>
                        <div className={cx('no-data__icon')}>
                            <Image
                                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/shoprating/3215f6ba1a0e877fa06e.png"
                                alt="No reviews"
                            />
                        </div>
                        <div className={cx('no-data__text')}>Chưa có đánh giá</div>
                    </div>
                ) : (
                    <>
                        <div className={cx('ratings__list')}>
                            <div className={cx('comment-list')} ref={commentListRef}>
                                {currentReviews.map((review, index) => (
                                    <div key={index} className={cx('product-rating')}>
                                        <div className={cx('product-rating__avatar')}>
                                            <div className={cx('user-avatar')}>
                                                <img
                                                    src={images.defaultAvatar}
                                                    alt={review?.user?.displayName || 'Avatar'}
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('product-rating__main')}>
                                            <div className={cx('product-rating__author-name')}>
                                                {review?.user?.displayName}
                                            </div>
                                            <div className={cx('rating-star')}>
                                                <Rating
                                                    readonly
                                                    initialValue={review?.rating}
                                                    allowFraction
                                                    size={18}
                                                    fillColor="#d0011b"
                                                    emptyColor="#d1d5db"
                                                />
                                            </div>
                                            <div className={cx('rating-time')}>
                                                {new Date(review.createdAt).toLocaleString('vi-VN')}
                                            </div>
                                            <div
                                                className={cx('rating-text')}
                                                dangerouslySetInnerHTML={{
                                                    __html: DOMPurify.sanitize(review?.content),
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                                scrollToRef={commentListRef}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ReviewList
