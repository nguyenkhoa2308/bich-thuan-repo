import classnames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import styles from './ProductDetail.module.scss'
import ProductInfo from '~/components/ProductInfo'
import Button from '~/components/Button'
import ReviewForm from '~/components/ReviewForm'
import SliderProducts from '~/components/SliderProducts'
import httpRequest from '~/utils/httpRequest'
import ReviewList from '~/components/ReviewList'
// import images from '~/assets/images'

const cx = classnames.bind(styles)

function ProductDetail() {
    const [product, setProduct] = useState()
    const [relatedProduct, setRelatedProduct] = useState([])
    const [isExpanded, setIsExpanded] = useState(false) // Trạng thái mở rộng mô tả
    const [reviews, setReviews] = useState([])
    const slug = useParams()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await httpRequest.get(`products/${slug.slug}`)
                // console.log(response)

                setProduct(response.product)
                setRelatedProduct(response.relatedProducts)
                setReviews(response.product.reviews)
            } catch (error) {
                console.error('Error fetching product:', error)
            }
        }
        fetchProduct()
    }, [slug])

    const description = product?.description || ''

    // Kiểm tra nếu mô tả trống
    const formatString =
        description.trim() === '' ? (
            <span>Chưa có mô tả cho sản phẩm này</span>
        ) : (
            description.split('\n').map((str, index) => (
                <span key={index}>
                    {str}
                    <br />
                </span>
            ))
        )

    // Hiển thị nội dung rút gọn nếu chưa mở rộng
    const shortDescription = description.length > 150 ? description.substring(0, 150) + '...' : description

    return (
        <div className={cx('wrapper')}>
            <div className={cx('product-detail-container')}>
                <div className={cx('container')}>
                    <div className={cx('product-detail-main', 'd-flex', 'flex-wrap', 'row')}>
                        {product && <ProductInfo data={product} />}
                        <div className={cx('description')}>
                            <div className={cx('description-header')}>
                                <h2 className={cx('description-title')}>Mô tả sản phẩm</h2>
                            </div>
                            <div className={cx('description-content', { expanded: isExpanded })}>
                                {isExpanded ? formatString : shortDescription}
                            </div>
                            {description.length > 150 && (
                                <div className={cx('action-section')}>
                                    <Button
                                        outline
                                        className={cx('toggle-btn')}
                                        onClick={() => setIsExpanded(!isExpanded)}
                                    >
                                        {isExpanded ? 'Rút gọn' : '+ Xem thêm nội dung'}
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className={cx('related-product-container', 'p-0', 'mt-5')}>
                            <h2 className={cx('heading-title')}>Có thể bạn cũng thích</h2>

                            <SliderProducts products={relatedProduct} />
                        </div>
                        <div className={cx('review-container', 'mt-5', 'mb-4')}>
                            <h2 className={cx('heading-title')}>Đánh giá sản phẩm</h2>
                            <ReviewForm slug={slug.slug} setReviews={setReviews} />

                            <ReviewList reviews={reviews} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
