import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';

import styles from './PurchasePage.module.scss';
import httpRequest from '~/utils/httpRequest';
import Button from '~/components/Button';
import OrderDetailDialog from '~/components/Dialog/OrderDetailDialog';
import { CartContext } from '~/contexts/CartContext';
import { ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);

function PurchasePage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updated, setUpdated] = useState(true);
    const [showDialog, setShowDialog] = useState(false);

    const { addMultipleToCart } = useContext(CartContext);

    const statusMapping = {
        Pending: { text: 'Chờ duyệt', className: 'pending' },
        Approved: { text: 'Đã duyệt', className: 'approved' },
        Shipping: { text: 'Đang giao', className: 'shipping' },
        Delivered: { text: 'Đã giao', className: 'delivered' },
        Received: { text: 'Đã nhận', className: 'received' },
        Cancelled: { text: 'Đã hủy', className: 'cancelled' },
    };

    useEffect(() => {
        if (!updated) return;

        const fetchOrder = async () => {
            try {
                const response = await httpRequest.get('/order/user');
                setOrders(response.orders);
            } catch (error) {
                setOrders([]);
            }
        };
        fetchOrder();
        setUpdated(false);
    }, [updated]);

    const handleViewDetail = (order) => {
        setShowDialog(true);
        setSelectedOrder(order);
    };

    const handleBuyAgain = async (items) => {
        try {
            await addMultipleToCart(
                items.map((item) => ({
                    productId: item.product._id,
                    quantity: 1,
                    variantId: item.variant._id,
                })),
            );
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm: ', error);
        }
    };

    const handleCancelOrder = async (id, status) => {
        try {
            await httpRequest.put(`/order/${id}/status`, {
                status,
            });
            setUpdated(true);
        } catch (error) {
            console.error('Lỗi khi duyệt đơn hàng:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div className={cx('order-card')} key={index}>
                            <div className={cx('order-info')}>
                                <div className={cx('header')}>
                                    <div className={cx('order-code')}>{order.orderCode}</div>
                                    <div className={cx('order-status', statusMapping[order.status]?.className)}>
                                        {statusMapping[order.status]?.text || 'Không xác định'}
                                    </div>
                                </div>
                                <div className={cx('content')}>
                                    {order.items.map((item, itemIndex) => (
                                        <div className={cx('product-container')} key={itemIndex}>
                                            <div className={cx('product-image')}>
                                                <img src={item.product.image} alt={item.product.name} />
                                            </div>
                                            <div className={cx('product-detail')}>
                                                <div className={cx('product-name')}>{item.product.name}</div>
                                                {item.variant.name !== 'default' && (
                                                    <div className={cx('product-variant')}>{item.variant.name}</div>
                                                )}

                                                <div className={cx('product-quantity')}>x{item.quantity}</div>
                                            </div>
                                            <div className={cx('product-price')}>
                                                {item.product.priceFinal !== item.product.priceOriginal && (
                                                    <del className={cx('price-original')}>
                                                        {new Intl.NumberFormat('en-US').format(
                                                            item.product.priceOriginal * 1000,
                                                        )}
                                                        ₫
                                                    </del>
                                                )}
                                                <span className={cx('price-final')}>
                                                    {new Intl.NumberFormat('en-US').format(
                                                        item.product.priceFinal * 1000,
                                                    )}
                                                    ₫
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={cx('order-price')}>
                                <span className={cx('order-price-title')}>Thành tiền: </span>₫
                                {new Intl.NumberFormat('en-US').format(order.totalPrice * 1000)}
                            </div>
                            <div className={cx('order-action')}>
                                {order.status === 'Received' && (
                                    <Button
                                        primary
                                        className={cx('buy-again-btn')}
                                        onClick={() => handleBuyAgain(order.items)}
                                    >
                                        Mua lại
                                    </Button>
                                )}
                                {order.status === 'Pending' && (
                                    <Button
                                        outline
                                        className={cx('cancel-btn')}
                                        onClick={() => handleCancelOrder(order._id, 'Cancelled')}
                                    >
                                        Hủy đơn hàng
                                    </Button>
                                )}
                                {order.status === 'Delivered' && (
                                    <Button
                                        primary
                                        className={cx('confirm-btn')}
                                        onClick={() => handleCancelOrder(order._id, 'Received')}
                                    >
                                        Đã nhận hàng
                                    </Button>
                                )}
                                <Button outline className={cx('view-btn')} onClick={() => handleViewDetail(order)}>
                                    Xem chi tiết
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={cx('no-orders')}>Bạn chưa từng mua đơn hàng nào</p>
                )}
            </div>
            <OrderDetailDialog show={showDialog} handleClose={() => setShowDialog(false)} order={selectedOrder} />
            <ToastContainer />
        </div>
    );
}

export default PurchasePage;
