import classNames from 'classnames/bind'
import { Outlet } from 'react-router-dom'

import styles from './DefaultLayout.module.scss'
import Header from '~/layouts/components/Header'
import Footer from '~/layouts/components/Footer'
import CustomerChat from '~/layouts/components/CustomerChat'

const cx = classNames.bind(styles)

function DefaultLayout() {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container', 'content-body')}>
                {/* <div className={cx('content')}>{children}</div> */}
                <Outlet />
            </div>
            <CustomerChat />
            <Footer />
        </div>
    )
}

export default DefaultLayout
