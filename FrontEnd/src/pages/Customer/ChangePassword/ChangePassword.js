import classnames from 'classnames/bind';
import { useState } from 'react';

import { Spinner } from 'react-bootstrap';
import { InputAdornment, FormControl, InputLabel, IconButton, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import styles from './ChangePassword.module.scss';
import PasswordForm from '~/components/PasswordForm';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';

const cx = classnames.bind(styles);

function ChangePassword() {
    const [passwordInput, setPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handles Display and Hide Password
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await httpRequest.post('/user/verify', {
                password: passwordInput,
            });
            if (response.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    setIsVerified(true);
                }, 1000);

                toast.success(<div>Xác minh thành công</div>, {
                    position: 'top-right',
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    transition: Zoom,
                });
            }
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setIsVerified(false);
                setError(error.response.data.message);
            }, 1000);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content-account')}>
                    <div className={cx('content-account__header')}>
                        <h1 className={cx('header-text')}>Đổi mật khẩu</h1>
                    </div>

                    {!isVerified ? (
                        <div className={cx('password-field')}>
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
                                <InputLabel htmlFor="outlined-adornment-password">
                                    Nhập mật khẩu hiện tại để xác minh
                                </InputLabel>
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
                                    label="Nhập mật khẩu hiện tại để xác minh"
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

                            <Button
                                primary
                                className={cx('submit-btn', {
                                    disabled: !passwordInput,
                                })}
                                onClick={() => handleSubmit()}
                            >
                                {loading ? <Spinner animation="border" className="mt-3" /> : <span> Xác nhận</span>}
                            </Button>
                        </div>
                    ) : (
                        <PasswordForm />
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ChangePassword;
