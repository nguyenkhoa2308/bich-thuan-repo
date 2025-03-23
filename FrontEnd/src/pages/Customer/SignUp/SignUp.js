import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';

import styles from './SignUp.module.scss';
import RegisterForm from '~/components/RegisterForm';

const cx = classnames.bind(styles);

function SignUp() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content-section')}>
                    <div className={cx('header')}>
                        <Link to="/login">
                            <h2 className={cx('title')}>Đăng nhập</h2>
                        </Link>
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                            sx={{ marginTop: '0', marginBottom: '0', borderWidth: '1px', borderColor: 'gray' }}
                        />

                        <h2 className={cx('title', 'active')}>Đăng ký</h2>
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}

export default SignUp;
