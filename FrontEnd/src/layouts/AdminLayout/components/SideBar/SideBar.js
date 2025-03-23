import classnames from 'classnames/bind';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useContext } from 'react';

import styles from './SideBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faBoxOpen, faList, faTruck, faUser, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '~/contexts/AuthContext';
// import { faUser } from '@fortawesome/free-regular-svg-icons';

// eslint-disable-next-line
const cx = classnames.bind(styles);

function SideBar() {
    const { auth } = useContext(AuthContext);

    const location = useLocation();

    const menuItems = [
        { path: '/admin', name: 'Dashboard', icon: <FontAwesomeIcon icon={faChartLine} /> },
        { path: '/admin/products', name: 'Sản phẩm', icon: <FontAwesomeIcon icon={faBoxOpen} /> },
        { path: '/admin/orders', name: 'Đơn hàng', icon: <FontAwesomeIcon icon={faTruck} /> },
        { path: '/admin/users', name: 'Người dùng', icon: <FontAwesomeIcon icon={faUser} /> },
        { path: '/admin/categories', name: 'Danh mục', icon: <FontAwesomeIcon icon={faList} /> },
        { path: '/', name: 'Quay về trang chủ', icon: <FontAwesomeIcon icon={faBackward} /> },
    ];

    return (
        <Navbar
            bg="dark"
            variant="dark"
            className="d-flex flex-column vh-100"
            style={{ width: '250px', position: 'fixed' }}
        >
            <Navbar.Brand className={cx('nav-header')}>Xin chào, {auth.user.name}</Navbar.Brand>
            <Nav className="flex-column w-100">
                {menuItems.map((item, index) => {
                    return (
                        <Nav.Link
                            as={Link}
                            to={item.path}
                            className={cx('text-white', 'nav-link', {
                                active: location.pathname === item.path,
                            })}
                            key={index}
                        >
                            <span className={cx('icon')}>{item.icon}</span>
                            {item.name}
                        </Nav.Link>
                    );
                })}
            </Nav>
        </Navbar>
    );
}

export default SideBar;
