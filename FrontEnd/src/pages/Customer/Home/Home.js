import classnames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './Home.module.scss'
import images from '~/assets/images'
// import Button from '~/components/Button';
import HeroBanner from '~/components/HeroBanner/HeroBanner'
import httpRequest from '~/utils/httpRequest'
import SliderProducts from '~/components/SliderProducts'
import Image from '~/components/Image'

const cx = classnames.bind(styles)

function Home() {
    const [products, setProducts] = useState(null)
    const [newProducts, setNewProducts] = useState(null)
    const [bestSellerProducts, setBestSellerProducts] = useState(null)

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await httpRequest.get('/products')
            // setProducts(response.data);
            setProducts(response)
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        if (!Array.isArray(products) || products.length === 0) return // Kiểm tra products trước khi xử lý

        const sortedBestSellingProducts = [...products]
            .filter((product) => product.sold !== undefined) // Đảm bảo product có thuộc tính sold
            .sort((a, b) => (b.sold || 0) - (a.sold || 0)) // Sắp xếp theo sold, tránh lỗi undefined
            .slice(0, 10)

        setBestSellerProducts(sortedBestSellingProducts)

        const sortedNewProducts = [...products]
            .filter((product) => product.createdAt !== undefined) // Đảm bảo có createdAt
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp từ mới -> cũ
            .slice(0, 10)

        setNewProducts(sortedNewProducts)
    }, [products])

    return (
        <div className={cx('wrapper')}>
            <div className={cx('hero-banner')}>
                <HeroBanner />
            </div>
            <div className={cx('home-category')}>
                <div className={cx('category-container')}>
                    <div className={cx('category-list')}>
                        <div className={cx('category-item')}>
                            <div className={cx('category-block')}>
                                <div className={cx('category-block--image')}>
                                    <Link to="/category/living-room">
                                        <img src={images.livingroom} alt="Phòng khách" />
                                    </Link>
                                </div>
                                <div className={cx('category-block--content')}>
                                    <h3 className={cx('block-title')}>
                                        <Link to="/category/living-room" className={cx('title-link')}>
                                            Phòng khách
                                        </Link>
                                    </h3>
                                    <Link to="/category/living-room" className={cx('view-btn')}>
                                        Xem ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={cx('category-item')}>
                            <div className={cx('category-block')}>
                                <div className={cx('category-block--image')}>
                                    <Link to="/category/bedroom">
                                        <img src={images.bedroom} alt="Phòng ngủ" />
                                    </Link>
                                </div>
                                <div className={cx('category-block--content')}>
                                    <h3 className={cx('block-title')}>
                                        <Link to="/category/bedroom" className={cx('title-link')}>
                                            Phòng ngủ
                                        </Link>
                                    </h3>
                                    <Link to="/category/bedroom" className={cx('view-btn')}>
                                        Xem ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={cx('category-item')}>
                            <div className={cx('category-block')}>
                                <div className={cx('category-block--image')}>
                                    <Link to="/category/kitchen">
                                        <img src={images.kitchen} alt="Phòng ăn và bếp" />
                                    </Link>
                                </div>
                                <div className={cx('category-block--content')}>
                                    <h3 className={cx('block-title')}>
                                        <Link to="/category/kitchen" className={cx('title-link')}>
                                            Phòng ăn và bếp
                                        </Link>
                                    </h3>
                                    <Link to="/category/kitchen" className={cx('view-btn')}>
                                        Xem ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={cx('category-item')}>
                            <div className={cx('category-block')}>
                                <div className={cx('category-block--image')}>
                                    <Link to="/category/office">
                                        <img src={images.office} alt="Phòng làm việc" />
                                    </Link>
                                </div>
                                <div className={cx('category-block--content')}>
                                    <h3 className={cx('block-title')}>
                                        <Link to="/category/office" className={cx('title-link')}>
                                            Phòng làm việc
                                        </Link>
                                    </h3>
                                    <Link to="/category/office" className={cx('view-btn')}>
                                        Xem ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('container')}>
                {/* <ProductItem /> */}
                <div className={cx('new-product-container')}>
                    <h2 className={cx('heading-title')}>Sản phẩm mới nhất</h2>
                    <SliderProducts products={newProducts} />
                </div>

                <div className={cx('best-seller-product-container')}>
                    <h2 className={cx('heading-title')}>Sản phẩm bán chạy</h2>
                    <SliderProducts products={bestSellerProducts} />
                </div>

                <div className={cx('sale-banner', 'row')}>
                    <div className={cx('banner__inner--block', 'col-lg-6', 'col-md-12', 'col-12')}>
                        <div className={cx('banner__inner--img')}>
                            <div className={cx('banner-hover-effect')} aria-label="Nến thơm">
                                <Image
                                    className={cx('image')}
                                    src="https://theme.hstatic.net/200000796751/1001266995/14/homebanner_1_img.jpg?v=89"
                                    alt="Chăn ga gối"
                                />
                            </div>
                        </div>
                    </div>
                    <div className={cx('banner__inner--block', 'col-lg-6', 'col-md-12', 'col-12')}>
                        <div className={cx('banner__inner--img')}>
                            <div className={cx('banner-hover-effect')} aria-label="Nến thơm">
                                <Image
                                    className={cx('image')}
                                    src="https://theme.hstatic.net/200000796751/1001266995/14/homebanner_2_img.jpg?v=83"
                                    alt="Nến thơm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('blogs-container')}>
                    <h2 className={cx('heading-title')}>Bài viết mới nhất</h2>
                    {/* <BestSellerProducts products={products} /> */}
                </div>
            </div>
        </div>
    )
}

export default Home
