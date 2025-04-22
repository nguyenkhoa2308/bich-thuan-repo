import classNames from 'classnames/bind'
import { useContext, useState } from 'react'

import styles from './Wishlists.module.scss'
import { WishlistContext } from '~/contexts/WishlistContext'
import ProductCard from '~/components/ProductCard'
import CustomPagination from '~/components/CustomPagination'

const cx = classNames.bind(styles)

function Wishlists() {
    const { wishlists } = useContext(WishlistContext)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const indexOfLastProduct = currentPage * itemsPerPage
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
    const currentProducts = wishlists.slice(indexOfFirstProduct, indexOfLastProduct)

    const totalPages = Math.ceil(wishlists.length / itemsPerPage)

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('heading')}>
                    <h1 className={cx('title')}>Danh Sách Yêu Thích Của Tôi</h1>
                </div>
                <div className={cx('wishlist-container', 'row')}>
                    {currentProducts.length === 0 ? (
                        <div>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</div>
                    ) : (
                        currentProducts.map((product, index) => {
                            return (
                                <div key={index} className={cx('product-item', 'col-md-3', 'col-6')}>
                                    <ProductCard product={product} />
                                </div>
                            )
                        })
                    )}
                </div>
                <CustomPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
        </div>
    )
}

export default Wishlists
