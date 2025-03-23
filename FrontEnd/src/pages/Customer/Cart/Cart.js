import classnames from 'classnames/bind';
import { useEffect, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './Cart.module.scss';
import { CartContext } from '~/contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import ConfirmDialog from '~/components/Dialog/ConfirmDialog';

const cx = classnames.bind(styles);

function Cart() {
    // eslint-disable-next-line
    const { cartItems, countItems, deleteCartItem, updateQuantityOfCartItem } = useContext(CartContext);
    const navigate = useNavigate();

    // eslint-disable-next-line
    const [cartItemId, setCartItemId] = useState();
    const [numberCart, setNumberCart] = useState(0);
    const [cartQuantities, setCartQuantities] = useState({});
    const [pendingUpdate, setPendingUpdate] = useState(null);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const handleUpdate = (quantity, cartItemId) => {
        setCartQuantities((prev) => ({
            ...prev,
            [cartItemId]: quantity,
        }));

        // updateQuantityOfCartItem(quantity, cartItemId); // Gọi API để cập nhật số lượng
        setPendingUpdate({ cartItemId });
    };

    const handleIncreaseQuantity = (stock, quantity, cartItemId) => {
        const newQuantity = (cartQuantities[cartItemId] || quantity) + 1;

        // Chỉ tăng số lượng nếu newQuantity <= stock
        if (newQuantity <= stock) {
            handleUpdate(newQuantity, cartItemId); // Gọi API để cập nhật số lượng
        }
    };

    const handleDecreaseQuantity = (quantity, cartItemId) => {
        const currentQuantity = cartQuantities[cartItemId] || quantity;

        const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;

        // Chỉ giảm số lượng nếu newQuantity < currentQuantity
        if (newQuantity !== currentQuantity) {
            // Kiểm tra nếu số lượng thay đổi
            handleUpdate(newQuantity, cartItemId); // Gọi API để cập nhật số lượng
        }
    };

    const handleRemove = (id) => {
        setIsConfirmDialogOpen(true);
        setCartItemId(id);
    };

    useEffect(() => {
        if (!pendingUpdate) return;

        const timer = setTimeout(() => {
            const { cartItemId } = pendingUpdate;
            updateQuantityOfCartItem(cartQuantities[cartItemId], cartItemId);
            setPendingUpdate(null);
        }, 500);

        return () => clearTimeout(timer);
    }, [pendingUpdate, cartQuantities, updateQuantityOfCartItem]);

    useEffect(() => {
        setNumberCart(countItems);
    }, [countItems]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('cart')}>
                <div className={cx('row')}>
                    <div className={cx('contentCart', 'col-lg-8', 'col-md-12', 'col-12')}>
                        <h1 className={cx('cartHeader')}>Giỏ hàng của bạn</h1>
                        <div className={cx('cartBody')}>
                            {cartItems?.items?.length > 0 ? (
                                <>
                                    <p className={cx('title-number-cart')}>
                                        Bạn đang có
                                        <strong className={cx('count-cart')}>{numberCart} sản phẩm</strong>
                                        trong giỏ hàng
                                    </p>
                                    <div className={cx('table-cart')}>
                                        {cartItems?.items?.map((cartItem, index) => (
                                            <div className={cx('cart-item')} key={index}>
                                                <div className={cx('item-image')}>
                                                    <Link to={`/products/${cartItem?.product?.slug}`}>
                                                        <img
                                                            src={`${cartItem?.product?.image}`}
                                                            alt={`${cartItem?.product?.name}`}
                                                        />
                                                    </Link>

                                                    <div
                                                        className={cx('remove')}
                                                        onClick={() => handleRemove(cartItem?._id)}
                                                    >
                                                        Xóa
                                                    </div>
                                                </div>
                                                <div className={cx('item-info')}>
                                                    <div className={cx('detail')}>
                                                        <h3 className={cx('title')}>{cartItem?.product?.name}</h3>
                                                        {!(cartItem?.variant?.name === 'default') && (
                                                            <div className={cx('variant')}>
                                                                <span>{cartItem?.variant?.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={cx('price')}>
                                                        {new Intl.NumberFormat('en-US').format(
                                                            cartItem?.product?.priceFinal * 1000,
                                                        )}
                                                        ₫
                                                        {cartItem?.product?.priceFinal !==
                                                            cartItem?.product?.priceOriginal && (
                                                            <del className={cx('original-price')}>
                                                                {new Intl.NumberFormat('en-US').format(
                                                                    cartItem?.product?.priceOriginal * 1000,
                                                                )}
                                                                ₫
                                                            </del>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={cx('total')}>
                                                    <div className={cx('item-total-price')}>
                                                        <span className={cx('total-price-value')}>
                                                            {new Intl.NumberFormat('en-US').format(
                                                                cartItem?.product?.priceFinal *
                                                                    1000 *
                                                                    cartItem?.quantity,
                                                            )}
                                                            ₫
                                                        </span>
                                                    </div>
                                                    <div className={cx('item-quantity')}>
                                                        <div className={cx('quantity', 'd-flex', 'align-items-center')}>
                                                            <div
                                                                className={cx('count-btn')}
                                                                onClick={() =>
                                                                    handleDecreaseQuantity(
                                                                        cartItem?.quantity,
                                                                        cartItem?._id,
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon icon={faMinus} />
                                                            </div>
                                                            <p className={cx('number')}>
                                                                {cartQuantities[cartItem?._id] || cartItem?.quantity}
                                                            </p>

                                                            <div className={cx('counter')}>
                                                                <div
                                                                    className={cx('count-btn')}
                                                                    onClick={() =>
                                                                        handleIncreaseQuantity(
                                                                            cartItem?.product?.stock,
                                                                            cartItem?.quantity,
                                                                            cartItem?._id,
                                                                        )
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon icon={faPlus} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={cx('cart-empty')}>Giỏ hàng của bạn đang trống</div>
                            )}
                        </div>
                    </div>
                    <div className={cx('sidebarCart', 'col-lg-4', 'col-md-12', 'col-12')}>
                        <div className={cx('wrap-order-summary')}>
                            <div className={cx('order-summary-block')}>
                                <h2 className={cx('summary-title')}>Thông tin đơn hàng</h2>
                                <div className={cx('summary-total')}>
                                    <p>
                                        Tổng tiền:
                                        <span>
                                            {cartItems?.items?.length > 0
                                                ? new Intl.NumberFormat('en-US').format(
                                                      cartItems?.totalPriceFinal * 1000,
                                                  )
                                                : 0}
                                            ₫
                                        </span>
                                    </p>
                                </div>
                                <div className={cx('summary-button')}>
                                    <Button
                                        primary
                                        className={cx('checkout-button', { disabled: cartItems?.items?.length === 0 })}
                                        onClick={() => navigate('/checkout')}
                                    >
                                        Thanh toán
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={() => {
                    deleteCartItem(cartItemId);
                    setIsConfirmDialogOpen(false);
                }}
                title="Bạn chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
            />
        </div>
    );
}

export default Cart;
