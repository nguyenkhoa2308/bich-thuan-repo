import classnames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import Slider from 'react-slick';

// import
import '~/components/NewProducts/slider.scss';
import styles from './BestSellerProducts.module.scss';
import ProductCard from '../ProductCard';
import { CartContext } from '~/contexts/CartContext';
import { ToastContainer } from 'react-toastify';
import ProductDialog from '../Dialog/ProductDialog';

const cx = classnames.bind(styles);

function BestSellerProducts({ products }) {
    const { addToCart } = useContext(CartContext);

    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [showProductDialogOpen, setShowProductDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const handleBeforeChange = () => setIsDragging(true);
    const handleAfterChange = () => setIsDragging(false);

    const handleClick = (e) => {
        if (isDragging) {
            e.preventDefault(); // Chặn click nếu vừa kéo
        }
    };

    const handleOpenDialog = async (product) => {
        setCurrentProduct(product);
        setShowProductDialogOpen(true);

        if (product.variant.length <= 1) {
            setShowProductDialogOpen(false);
            await addToCart(product._id, 1, product.variant[0]?._id);
        }
    };

    useEffect(() => {
        if (!Array.isArray(products) || products.length === 0) return; // Kiểm tra products trước khi xử lý

        const sortedBestSellingProducts = [...products]
            .filter((product) => product.sold !== undefined) // Đảm bảo product có thuộc tính sold
            .sort((a, b) => (b.sold || 0) - (a.sold || 0)) // Sắp xếp theo sold, tránh lỗi undefined
            .slice(0, 10);

        setBestSellingProducts(sortedBestSellingProducts);
    }, [products]);

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
    };
    // console.log(bestSellingProducts);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Slider {...settings} className={cx('slider')}>
                    {bestSellingProducts.map((item, index) => {
                        return (
                            <ProductCard
                                product={item}
                                key={index}
                                handleClick={handleClick}
                                openDialog={handleOpenDialog}
                                isHome={true}
                            />
                        );
                    })}
                </Slider>
                <ProductDialog
                    data={currentProduct}
                    isOpen={showProductDialogOpen}
                    onClose={() => setShowProductDialogOpen(false)}
                    onConfirm={() => {
                        setShowProductDialogOpen(false);
                    }}
                />
                <ToastContainer />
            </div>
        </div>
    );
}

export default BestSellerProducts;
