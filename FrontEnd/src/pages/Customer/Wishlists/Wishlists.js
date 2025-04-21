import classNames from 'classnames/bind'

import styles from './Wishlists.module.scss'

const cx = classNames.bind(styles)

function Wishlists() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('heading')}>
                    <h1 className={cx('title')}>Danh Sách Yêu Thích Của Tôi</h1>
                </div>
            </div>
        </div>
    )
}

export default Wishlists
