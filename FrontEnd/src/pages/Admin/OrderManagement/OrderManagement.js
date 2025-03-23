import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Zoom, toast, ToastContainer } from 'react-toastify';

import { useDebounce } from '~/hooks';
import styles from './OrderManagement.module.scss';
import httpRequest from '~/utils/httpRequest';
import OrderDetailDialog from '~/components/Dialog/OrderDetailDialog';
import CustomPagination from '~/components/CustomPagination';
import ConfirmDialog from '~/components/Dialog/ConfirmDialog';

const cx = classNames.bind(styles);

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    // const [updated, setUpdated] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedValue = useDebounce(searchTerm, 1000);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(orders.length / itemsPerPage);

    const statusMap = {
        Pending: { text: 'Duyệt đơn', next: 'Approved', variant: 'warning' },
        Approved: { text: 'Giao hàng', next: 'Shipping', variant: 'info' },
        Shipping: { text: 'Đã giao', next: 'Delivered', variant: 'primary' },
        Delivered: { text: 'Đã nhận', next: 'Received', variant: 'success' },
        // Received: { text: 'Hoàn thành', next: 'Completed', variant: 'success' },
    };
    const statusMapping = {
        Pending: { text: 'Chờ duyệt', className: 'pending' },
        Approved: { text: 'Đã duyệt', className: 'approved' },
        Shipping: { text: 'Đang giao', className: 'shipping' },
        Delivered: { text: 'Đã giao', className: 'delivered' },
        Received: { text: 'Hoàn thành', className: 'completed' },
        Cancelled: { text: 'Đã hủy', className: 'cancelled' },
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, statusFilter]);

    // // 🛒 Lấy danh sách đơn hàng từ API
    const fetchOrders = async () => {
        const queryParams = new URLSearchParams();
        if (statusFilter) queryParams.append('status', statusFilter);
        if (debouncedValue) queryParams.append('search', debouncedValue);

        try {
            const res = await httpRequest.get(`/order?${queryParams.toString()}`);
            setOrders(res);
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
        }
    };

    // ✅ Duyệt đơn hàng
    const updateOrderStatus = async (orderId, status) => {
        try {
            console.log(status);

            await httpRequest.put(`/order/${orderId}/status`, {
                status,
            });
            fetchOrders();
        } catch (error) {
            console.error('Lỗi khi duyệt đơn hàng:', error);
        }
    };

    const handleViewDetail = (order) => {
        setShowDialog(true);
        setSelectedOrder(order);
    };

    const handleDelete = async () => {
        setShowConfirmDialog(false);

        try {
            const res = await httpRequest.delete(`/order/delete/${selectedOrder._id}`);
            if (res.status === 200) {
                toast.success('Xóa đơn hàng thành công!', {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    transition: Zoom,
                });
                fetchOrders();
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Chuyển trang
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);

        // Cuộn trang về vị trí danh sách sản phẩm (hoặc vị trí mong muốn)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <h2>Quản lý đơn hàng</h2>

            {/* Bộ lọc và tìm kiếm */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={cx('select-container')}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Pending">Chờ xác nhận</option>
                        <option value="Approved">Đã duyệt</option>
                        <option value="Shipping">Đang vận chuyển</option>
                        <option value="Delivered">Đã giao</option>
                        <option value="Received">Đã nhận</option>
                        <option value="Cancelled">Đã hủy</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Control
                        className={cx('input-field')}
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn,..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>

            {/* Bảng danh sách đơn hàng */}
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {/* <th className="text-center">#</th> */}
                            <th className="text-center">Mã đơn</th>
                            <th className="text-center">Tên Khách hàng</th>
                            <th className="text-center">Tên người nhận</th>
                            <th className="text-center">SĐT</th>
                            <th className="text-center">Ngày mua</th>
                            <th className="text-center">Tổng tiền</th>
                            <th className="text-center">Trạng thái</th>
                            <th className="text-center">Thay đổi trạng thái</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.orderCode}</td>
                                <td>
                                    {order.user?.lastName} {order.user?.firstName}
                                </td>
                                <td>{order.shippingAddress?.fullName}</td>
                                <td>{order.shippingAddress?.phone}</td>
                                <td>
                                    {new Date(order.createdAt).toLocaleString('vi-VN', {
                                        timeZone: 'Asia/Ho_Chi_Minh',
                                    })}
                                </td>
                                <td>{new Intl.NumberFormat('en-US').format(order.totalPrice * 1000)}</td>
                                <td className={cx('status-container')}>
                                    <div className={cx('order-status', statusMapping[order.status]?.className)}>
                                        {statusMapping[order.status]?.text || 'Không xác định'}
                                    </div>
                                </td>
                                <td>
                                    {order.status !== 'Received' && order.status !== 'Cancelled' && (
                                        <>
                                            {statusMap[order.status] && (
                                                <Button
                                                    variant={statusMap[order.status].variant}
                                                    onClick={() =>
                                                        updateOrderStatus(order._id, statusMap[order.status].next)
                                                    }
                                                    className={cx('action-btn')}
                                                >
                                                    {statusMap[order.status].text}
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                                className={cx('action-btn')}
                                            >
                                                Hủy
                                            </Button>
                                        </>
                                    )}
                                </td>
                                <td className={cx('view-detail-container')}>
                                    <Button className={cx('view-detail')} onClick={() => handleViewDetail(order)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>

                                    <Button
                                        className={cx('view-detail')}
                                        onClick={() => {
                                            setShowConfirmDialog(true);
                                            setSelectedOrder(order);
                                        }}
                                        variant="danger"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <OrderDetailDialog show={showDialog} handleClose={() => setShowDialog(false)} order={selectedOrder} />
            <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onConfirm={handleDelete}
                onClose={() => setShowConfirmDialog(false)}
                title="Bạn có chắc chắn xóa đơn hàng này không?"
            />
            <ToastContainer />
        </div>
    );
};

export default OrderManagement;
