import className from 'classnames/bind'
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'

import styles from './PaymentAccess.module.scss'
import Button from '~/components/Button'

const cx = className.bind(styles)

function PaymentAccess() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const params = new URLSearchParams(search)

    const orderId = params.get('orderId')
    const amount = params.get('amount')

    return (
        <div className={cx('wrapper', 'd-flex', 'justify-content-center', 'align-items-center', 'flex-column')}>
            <div
                className={cx('page-heading', 'd-flex', 'justify-content-center', 'align-items-center', 'flex-column')}
            >
                <div className={cx('success-icon')}>
                    <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className={cx('success-text')}>Thanh toán thành công</div>
            </div>
            <div className={cx('page-body')}>
                <p className={cx('order-code')}>
                    <b>Mã đơn hàng:</b> {orderId}
                </p>
                <p className={cx('total-amount')}>
                    <b>Tổng tiền:</b> {new Intl.NumberFormat('en-US').format(amount)}₫
                </p>
                <p className={cx('paymemt-method')}>
                    <b>Phương thức thanh toán: </b>Ví Momo{' '}
                </p>
            </div>
            <div className={cx('page-footer')}>
                <Button className={cx('btn-back')} onClick={() => navigate('/')} primary>
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    )
}

export default PaymentAccess
