import classnames from 'classnames/bind'
import { useContext, useState, useEffect, useMemo } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import styles from './AccountLayout.module.scss'
import Header from '~/layouts/components/Header'
import Footer from '../components/Footer'
import CustomerChat from '~/layouts/components/CustomerChat'
import { AuthContext } from '~/contexts/AuthContext'
import { ClipBoardListIcon } from '~/components/Icons'
import Image from '~/components/Image'

const cx = classnames.bind(styles)

const PROFILE_OPTION = [
    { title: 'Hồ Sơ', to: '/account' },
    { title: 'Địa Chỉ', to: '/account/addresses' },
    { title: 'Danh sách yêu thích', to: '/account/wishlist' },
    { title: 'Đổi Mật Khẩu', to: '/account/password' },
]

function AccountLayout() {
    const { auth } = useContext(AuthContext)
    const location = useLocation()
    const [activeMenu, setActiveMenu] = useState()

    const userPaths = useMemo(() => PROFILE_OPTION.map((item) => item.to), [])

    useEffect(() => {
        if (userPaths.includes(location.pathname)) {
            setActiveMenu(true)
        } else {
            setActiveMenu(false)
        }
    }, [location.pathname, userPaths])

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('sidebar')}>
                    <div className={cx('sidebar-header')}>
                        <Link to="/account" className={cx('sidebar-header-left', 'd-flex', 'align-items-center')}>
                            <div className={cx('avatar-container')}>
                                <Image src={auth?.user.avatar} className={cx('user-avatar')} />
                            </div>
                        </Link>
                        <div className={cx('sidebar-header-right')}>
                            <div className={cx('sidebar-name')}>{auth.user.name}</div>
                            <div className={cx('sidebar-edit')}>
                                <Link to="/account">
                                    <span className={cx('user-edit-icon')}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </span>
                                    <span className={cx('user-edit-text')}>Sửa hồ sơ</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={cx('sidebar-menu')}>
                        <div className={cx('menu-item')}>
                            <div className={cx('menu-item-header')}>
                                <Link to="/account" className={cx('menu-item-link')}>
                                    <span className={cx('menu-header-icon')}>
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <span className={cx('menu-header-text')}>Tài Khoản Của Tôi</span>
                                </Link>
                            </div>
                            <div
                                className={cx('menu-item-body', {
                                    active: activeMenu,
                                })}
                            >
                                <div className={cx('menu-item-body-list')}>
                                    {PROFILE_OPTION.map((item, index) => (
                                        <Link
                                            to={item.to}
                                            key={index}
                                            className={cx('list-item', {
                                                active: location.pathname === item.to,
                                            })}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={cx('menu-item-header')}>
                            <Link to="/account/purchase" className={cx('menu-item-link')}>
                                <span className={cx('menu-header-icon')}>
                                    <ClipBoardListIcon />
                                </span>
                                <span
                                    className={cx('menu-header-text', {
                                        active: location.pathname === '/account/purchase',
                                    })}
                                >
                                    Đơn Mua
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
            <CustomerChat />
            <Footer />
        </div>
    )
}

export default AccountLayout
