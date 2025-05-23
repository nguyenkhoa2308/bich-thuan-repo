import classnames from 'classnames/bind'
import { useContext, useState } from 'react'
import Slider from 'react-slick'

// import
import './slider.scss'
import styles from './SliderProducts.module.scss'
import ProductCard from '../ProductCard'
import ProductDialog from '../Dialog/ProductDialog'
import { CartContext } from '~/contexts/CartContext'

const cx = classnames.bind(styles)

function NewProducts({ products }) {
    const { addToCart } = useContext(CartContext)

    const [isDragging, setIsDragging] = useState(false)
    const [showProductDialogOpen, setShowProductDialogOpen] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)

    const handleBeforeChange = () => setIsDragging(true)
    const handleAfterChange = () => setIsDragging(false)

    const handleClick = (e) => {
        if (isDragging) {
            e.preventDefault()
        }
    }

    const handleOpenDialog = async (product) => {
        setCurrentProduct(product)
        setShowProductDialogOpen(true)

        if (product.variant.length <= 1) {
            setShowProductDialogOpen(false)
            await addToCart(product._id, 1, product.variant[0]?._id)
        }
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        swipeToSlide: true, // Cho phép vuốt tự nhiên hơn
        draggable: true, // Cho phép kéo bằng chuột
        swipe: true, // Cho phép vuốt trên điện thoại
        touchMove: true,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        beforeChange: handleBeforeChange,
        afterChange: handleAfterChange,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Slider {...settings} className={cx('slider')}>
                    {products?.map((item, index) => {
                        return (
                            <ProductCard
                                product={item}
                                key={index}
                                handleClick={handleClick}
                                isHome={true}
                                openDialog={handleOpenDialog}
                            />
                        )
                    })}
                </Slider>
                <ProductDialog
                    data={currentProduct}
                    isOpen={showProductDialogOpen}
                    onClose={() => setShowProductDialogOpen(false)}
                    onConfirm={() => {
                        setShowProductDialogOpen(false)
                    }}
                />
            </div>
        </div>
    )
}

export default NewProducts
