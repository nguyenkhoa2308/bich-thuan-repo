import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';

import styles from './Login.module.scss';
import LoginForm from '~/components/LoginForm';

const cx = classnames.bind(styles);

function Login() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content-section')}>
                    <div className={cx('header')}>
                        <h2 className={cx('title', 'active')}>Đăng nhập</h2>
                        <Divider
                            orientation="vertical"
                            variant="middle"
                            flexItem
                            sx={{ marginTop: '0', marginBottom: '0', borderWidth: '1px', borderColor: 'gray' }}
                        />
                        <Link to="/register">
                            <h2 className={cx('title')}>Đăng ký</h2>
                        </Link>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;
