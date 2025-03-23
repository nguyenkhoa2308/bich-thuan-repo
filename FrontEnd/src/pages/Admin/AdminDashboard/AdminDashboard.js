import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faDollar, faTruck, faUser } from '@fortawesome/free-solid-svg-icons';

import styles from './AdminDashboard.module.scss';
import httpRequest from '~/utils/httpRequest';

const cx = classnames.bind(styles);
Chart.register(...registerables);

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await httpRequest.get('/admin/stats');
                console.log(res);

                setStats(res);
            } catch (error) {
                console.error('Lỗi lấy dữ liệu thống kê:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Container className={cx('loading')}>
                <Spinner animation="border" />
            </Container>
        );
    }

    const chartData = {
        labels: stats?.sales.map((item) => item.month),
        datasets: [
            {
                label: 'Doanh thu',
                data: stats?.sales.map((item) => item.revenue),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <Container className={cx('dashboard')}>
            <h2 className="my-4">Thống kê</h2>
            <Row>
                <Col md={3}>
                    <Card className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faBoxOpen} className={cx('card-icon', 'product-icon')} />
                        <div>
                            <h5 className={cx('card-title')}>Sản phẩm</h5>
                            <h3>{stats?.totalProducts}</h3>
                        </div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faTruck} className={cx('card-icon', 'order-icon')} />
                        <div>
                            <h5 className={cx('card-title')}>Đơn hàng</h5>
                            <h3>{stats?.totalOrders}</h3>
                        </div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faUser} className={cx('card-icon', 'user-icon')} />
                        <div>
                            <h5 className={cx('card-title')}>Người dùng</h5>
                            <h3>{stats?.totalUsers}</h3>
                        </div>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className={cx('stat-card')}>
                        <FontAwesomeIcon icon={faDollar} className={cx('card-icon', 'revenue-icon')} />
                        <div>
                            <h5 className={cx('card-title')}>Doanh thu</h5>
                            <h3>{stats?.totalRevenue.toLocaleString()},000 đ</h3>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Card className={cx('chart-card')}>
                <h5 className={cx('chart-title')}>Doanh thu theo tháng</h5>
                <Bar data={chartData} />
            </Card>
        </Container>
    );
}

export default AdminDashboard;
