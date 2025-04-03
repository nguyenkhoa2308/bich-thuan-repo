import classNames from 'classnames/bind'
import { Outlet } from 'react-router-dom'

import styles from './HeaderOnly.module.scss'
import Header from '~/layouts/components/Header'

const cx = classNames.bind(styles)

function HeaderOnly() {
    return (
        <div>
            <Header />
            <div className={cx('container')}>
                {/* <div className={cx('content')}>{children}</div> */}
                <Outlet />
            </div>
        </div>
    )
}

export default HeaderOnly
