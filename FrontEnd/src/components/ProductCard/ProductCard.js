import classnames from 'classnames/bind';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import styles from './ProductCard.module.scss';
import { CartIcon } from '~/components/Icons';
import Button from '~/components/Button';
import ProductDialog from '~/components/Dialog/ProductDialog';
import { CartContext } from '~/contexts/CartContext';
// import { ToastContainer } from 'react-toastify';

const cx = classnames.bind(styles);

function ProductCard({ product, handleClick, isHome = false, openDialog }) {
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState();

    const { addToCart } = useContext(CartContext);

    const handleDragStart = (e) => {
        e.preventDefault();
    };

    const handleAddToCart = async (product) => {
        if (isHome) {
            openDialog(product);
        } else {
            setIsProductDialogOpen(true);
            setCurrentProduct(product);

            if (product.variant.length <= 1) {
                setIsProductDialogOpen(false);
                await addToCart(product._id, 1, product.variant[0]?._id);
            }
        }
    };

    return (
        <div className={cx('product-container')}>
            <div className={cx('product-card')}>
                <div className={cx('product-image-container')}>
                    <Link to={`/products/${product.slug}`} onClick={handleClick}>
                        <img src={product.image} alt={product.name} className={cx('product-image')} />
                    </Link>
                </div>
                <div className={cx('product-detail')}>
                    <Link
                        to={`/products/${product.slug}`}
                        onClick={handleClick}
                        className={cx('product-link')}
                        onDragStart={handleDragStart}
                    >
                        <h3 className={cx('product-name')}>{product.name}</h3>
                    </Link>
                    <div className={cx('product-price')}>
                        <span
                            className={cx('price-final', {
                                sale: product.priceFinal !== product.priceOriginal,
                            })}
                        >
                            {new Intl.NumberFormat('en-US').format(product.priceFinal * 1000)}₫
                        </span>
                        {product.priceFinal !== product.priceOriginal && (
                            <span className={cx('price-original')}>
                                {new Intl.NumberFormat('en-US').format(product.priceOriginal * 1000)}₫
                            </span>
                        )}
                    </div>
                    <div className={cx('product-action')}>
                        <div className={cx('action-btn')}>
                            <Button
                                text
                                small
                                className={cx('add-to-cart-btn', {
                                    disabled: product.stock === 0,
                                })}
                                onClick={() => handleAddToCart(product)}
                                // rightIcon={<CartIcon width="1.6rem" height="3.1rem" />}
                            >
                                {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                                <span
                                    className={cx('cart-icon', {
                                        disabled: product.stock === 0,
                                    })}
                                >
                                    <CartIcon width="1.6rem" height="3.1rem" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {!isHome && (
                <ProductDialog
                    data={currentProduct}
                    isOpen={isProductDialogOpen}
                    onClose={() => setIsProductDialogOpen(false)}
                    onConfirm={() => {
                        setIsProductDialogOpen(false);
                    }}
                />
            )}
            {/* <ToastContainer /> */}
        </div>
    );
}

export default ProductCard;
