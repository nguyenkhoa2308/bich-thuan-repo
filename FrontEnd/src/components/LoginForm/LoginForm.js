import classnames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

// Material UI Imports
import { TextField, InputAdornment, FormControl, InputLabel, IconButton, OutlinedInput } from '@mui/material';

// Material UI Icon Imports
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import styles from './LoginForm.module.scss';
import Button from '~/components/Button';
import { login } from '~/services/authService';
import { AuthContext } from '~/contexts/AuthContext';
import { CartContext } from '~/contexts/CartContext';
import { useAddress } from '~/contexts/AddressContext';
import httpRequest from '~/utils/httpRequest';

const cx = classnames.bind(styles);

function LoginForm() {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);
    const { getCart } = useContext(CartContext);
    const { getAddresses } = useAddress();
    // const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //Inputs
    const [emailInput, setEmailInput] = useState('');
    const [forgotEmail, setForgotEmail] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isForgotPassword, setIsForgotPassword] = useState(false);

    // Handles Display and Hide Password
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async () => {
        const res = await login(emailInput, passwordInput);

        if (res && res.EC === 0) {
            localStorage.setItem('access_token', res.access_token);
            setAuth({
                isAuthenticated: true,
                user: {
                    id: res?.user?.id ?? '',
                    email: res?.user?.email ?? '',
                    name: res?.user?.name ?? '',
                    role: res?.user?.role ?? '',
                },
            });
            getCart();
            getAddresses();
            // console.log(res);
            navigate('/');
        } else {
            setError(res.EM);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngừng hành động mặc định của Enter
            if (isForgotPassword && forgotEmail) {
                handleForgotPassword();
            }
            if (!isForgotPassword && emailInput && passwordInput) {
                handleLogin();
            } // Gọi hàm đăng nhập nếu có đủ thông tin
        }
    };

    const handleBackLogin = () => {
        setEmailInput('');
        setForgotEmail('');
        setPasswordInput('');
        setIsForgotPassword(false);
    };

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const res = await httpRequest.post('/user/forgot-password', {
                email: forgotEmail,
            });

            if (res.status === 200) {
                setIsForgotPassword(false);
                setForgotEmail('');

                toast.success(
                    <div>
                        Gửi Email thành công <br /> Vui lòng kiểm tra trong hòm thư email!
                    </div>,
                    {
                        position: 'top-right',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        transition: Zoom,
                    },
                );
            }
        } catch (error) {
            toast.error(
                <div>
                    Gửi Email thất bại <br /> Do {error.response.data.message}!
                </div>,
                {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    transition: Zoom,
                },
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {!isForgotPassword && (
                    <div className={cx('login-inner')} onKeyDown={handleKeyDown}>
                        <TextField
                            label="Email"
                            value={emailInput}
                            fullWidth
                            sx={{
                                mb: 2,
                                '.MuiOutlinedInput-root, .MuiInputLabel-root': {
                                    fontSize: '1.3rem',
                                    fontFamily: 'QuickSand',
                                    fontWeight: '600',
                                },
                                '.MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--primary)',
                                },
                                '.MuiOutlinedInput-root': {
                                    '&.Mui-focused.MuiInputBase-root fieldset': {
                                        borderColor: 'var(--primary)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.4)',
                                    },
                                },
                            }}
                            onChange={(event) => {
                                setEmailInput(event.target.value);
                            }}
                        />
                        <FormControl
                            fullWidth
                            variant="outlined"
                            sx={{
                                mb: 2,
                                '.MuiOutlinedInput-root, .MuiInputLabel-root': {
                                    fontSize: '1.3rem',
                                    fontFamily: 'QuickSand',
                                    fontWeight: '600',
                                },
                                '.MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--primary)',
                                },
                                '.MuiOutlinedInput-root': {
                                    '&.Mui-focused.MuiInputBase-root fieldset': {
                                        borderColor: 'var(--primary)',
                                    },

                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.4)',
                                    },
                                },
                            }}
                            // className={cx('input-field')}
                        >
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                value={passwordInput}
                                onChange={(event) => {
                                    setPasswordInput(event.target.value);
                                }}
                            />
                        </FormControl>
                        {error && (
                            <div className={cx('error-container')}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <span className={cx('error-message')}>{error}</span>
                            </div>
                        )}
                        <div className={cx('forgot-password-link')} onClick={() => setIsForgotPassword(true)}>
                            Quên mật khẩu?
                        </div>
                        <Button
                            primary
                            className={cx('login-btn', {
                                disabled: !emailInput || !passwordInput,
                            })}
                            onClick={() => handleLogin()}
                        >
                            Đăng nhập
                        </Button>
                        <p className={cx('signup-text')}>
                            Khách hàng mới?{' '}
                            <Link to="/register" className={cx('signup-link')}>
                                Tạo tài khoản
                            </Link>
                        </p>
                    </div>
                )}
                {isForgotPassword && (
                    <div className={cx('forget-password-container')} onKeyDown={handleKeyDown}>
                        <TextField
                            label="Email"
                            placeholder="Vui lòng nhập email của bạn"
                            value={forgotEmail}
                            fullWidth
                            sx={{
                                mb: 2,
                                '.MuiOutlinedInput-root, .MuiInputLabel-root': {
                                    fontSize: '1.3rem',
                                    fontFamily: 'QuickSand',
                                    fontWeight: '600',
                                },
                                '.MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--primary)',
                                },
                                '.MuiOutlinedInput-root': {
                                    '&.Mui-focused.MuiInputBase-root fieldset': {
                                        borderColor: 'var(--primary)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.4)',
                                    },
                                },
                            }}
                            onChange={(event) => {
                                setForgotEmail(event.target.value);
                            }}
                        />
                        <Button
                            primary
                            className={cx('send-email-btn', {
                                disabled: !forgotEmail,
                            })}
                            onClick={() => handleForgotPassword()}
                        >
                            {loading ? <Spinner animation="border" className="mt-3" /> : <span> Gửi email</span>}
                        </Button>
                        <p className={cx('login-text')}>
                            Quay lại
                            <span to="/login" className={cx('login-link')} onClick={() => handleBackLogin()}>
                                đăng nhập
                            </span>
                        </p>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginForm;
