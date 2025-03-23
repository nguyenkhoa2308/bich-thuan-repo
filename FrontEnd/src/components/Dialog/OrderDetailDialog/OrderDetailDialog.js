import classNames from 'classnames/bind';
import { Modal, Button, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import styles from './OrderDetailDialog.module.scss';

const cx = classNames.bind(styles);

const OrderDetailDialog = ({ show, handleClose, order }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    const getOrderStatusLabel = (status) => {
        const statusMap = {
            Pending: 'Chờ xác nhận',
            Approved: 'Đã duyệt',
            Shipping: 'Đang giao hàng',
            Delivered: 'Đã giao hàng',
            Received: 'Đã nhận',
            Cancelled: 'Đã hủy',
        };
        return statusMap[status] || status;
    };

    if (!order) return null; // Nếu chưa có đơn hàng, không hiển thị gì

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    <strong>Mã đơn hàng: </strong> {order.orderCode}
                </p>
                <p>
                    <strong>Người đặt hàng: </strong> {order.user?.firstName} {order.user?.lastName}
                </p>
                <p>
                    <strong>Người nhận hàng: </strong> {order.shippingAddress?.fullName}
                </p>
                <p>
                    <strong>Số điện thoại: </strong> {order.shippingAddress?.phone}
                </p>
                <p>
                    <strong>Địa chỉ giao hàng: </strong>
                    {order.shippingAddress?.detailAddress}, {order.shippingAddress?.ward},{' '}
                    {order.shippingAddress?.district}, {order.shippingAddress?.city}
                </p>
                <p>
                    <strong>Phương thức thanh toán:</strong>{' '}
                    {order.banking === 1 ? 'Thanh toán qua ngân hàng' : 'Thanh toán khi nhận hàng'}
                </p>
                <p>
                    <strong>Trạng thái:</strong> {getOrderStatusLabel(order.status)}
                </p>

                <h4>Sản phẩm trong đơn hàng: </h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td className={cx('product-container')}>
                                    <div className={cx('product-image')}>
                                        <img src={item.product.image} alt={item.product?.name} />
                                    </div>
                                    <div className={cx('product-detail')}>
                                        <div className={cx('product-name')}>{item.product?.name}</div>
                                        {item.variant?.name !== 'default' && (
                                            <div className={cx('product-variant')}>{item?.variant?.name}</div>
                                        )}
                                    </div>
                                </td>
                                <td>{item.quantity}</td>
                                <td>
                                    <div className={cx('product-price')}>
                                        <span className={cx('price-final')}>
                                            {new Intl.NumberFormat('en-US').format(item.product.priceFinal * 1000)}₫
                                        </span>
                                        {item.product.priceFinal !== item.product.priceOriginal && (
                                            <del className={cx('price-original')}>
                                                {new Intl.NumberFormat('en-US').format(
                                                    item.product.priceOriginal * 1000,
                                                )}
                                                ₫
                                            </del>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={3}>
                                <div className={cx('order-price')}>
                                    <span className={cx('order-price-title')}>Thành tiền: </span>
                                </div>
                            </td>
                            <td>
                                <span className={cx('total-price')}>
                                    ₫{new Intl.NumberFormat('en-US').format(order.totalPrice * 1000)}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                {order.status === 'Pending' && !isAdminPage && (
                    <Button
                        variant="success"
                        onClick={() => {
                            window.open(order.link_payment, '_blank');
                            handleClose();
                        }}
                        className={cx('custom-btn')}
                    >
                        Thanh toán ngay
                    </Button>
                )}
                <Button variant="secondary" onClick={handleClose} className={cx('custom-btn')}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailDialog;
