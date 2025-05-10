import classNames from 'classnames/bind'
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

import styles from './StaticPageLayout.module.scss'
import Header from '../components/Header'
import Footer from '../components/Footer'

const cx = classNames.bind(styles)

const MENU_ITEM = [
    { title: 'Chính sách bảo hành', to: '/pages/warranty-policy' },
    { title: 'Chi phí vận chuyển', to: '/pages/shipping-cost' },
    { title: 'Chính sách đổi trả và hoàn tiền', to: '/pages/return-and-refund-policy' },
    { title: 'Chính sách vận chuyển và giao nhận', to: '/pages/shipping-policy' },
    { title: 'Các hình thức thanh toán', to: '/pages/payment-methods' },
    { title: 'Chính sách bảo mật thông tin', to: 'pages/privacy-policy' },
]

function StaticPageLayout() {
    const [open, setOpen] = useState(true)

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container', 'my-5', 'content')}>
                <div className={cx('row')}>
                    <div className={cx('col-lg-9', 'col-md-8', 'col-12', 'px-4')}>
                        <Outlet />
                    </div>
                    <div className={cx('col-lg-3', 'col-md-4', 'col-12', 'px-4')}>
                        <aside className={cx('sidebar-page')}>
                            <div
                                className={cx('group-sidebox', {
                                    closed: !open,
                                })}
                            >
                                <div className={cx('sidebox-title')}>
                                    <h3 className={cx('htitle')} onClick={() => setOpen(!open)}>
                                        Các nội dung khác
                                    </h3>
                                </div>
                                <div
                                    className={cx('sidebox-content', {
                                        'sidebox-content-toggled': !open,
                                    })}
                                >
                                    <ul className={cx('menu-list')}>
                                        {MENU_ITEM.map((item, index) => {
                                            return (
                                                <li className={cx('list-item')} key={index}>
                                                    <Link className={cx('item-link')} to={item.to}>
                                                        {item.title}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default StaticPageLayout
