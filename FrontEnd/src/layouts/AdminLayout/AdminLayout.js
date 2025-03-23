import classNames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

import styles from './AdminLayout.module.scss';

import SideBar from '~/layouts/AdminLayout/components/SideBar';

const cx = classNames.bind(styles);

function AdminLayout() {
    return (
        <div className={cx('wrapper')}>
            <SideBar className="fixed h-full w-64" />
            <div className={cx('container', 'flex-1', 'p-4', 'admin-content')}>
                {/* <div className={cx('content')}>{children}</div> */}
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
