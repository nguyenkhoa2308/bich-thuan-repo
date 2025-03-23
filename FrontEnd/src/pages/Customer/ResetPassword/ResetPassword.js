import classnames from 'classnames/bind';
import { useParams } from 'react-router-dom';

import styles from './ResetPassword.module.scss';

import PasswordForm from '~/components/PasswordForm';

const cx = classnames.bind(styles);

function ResetPassword() {
    // const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    const params = useParams();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content-account')}>
                    <div className={cx('content-account__header')}>
                        <h1 className={cx('header-text')}>Phục hồi mật khẩu</h1>
                    </div>
                    <PasswordForm params={params} />
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
