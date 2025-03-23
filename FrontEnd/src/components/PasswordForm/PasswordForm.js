import classnames from 'classnames/bind';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, Zoom, toast } from 'react-toastify';

// Material UI Imports
import { InputAdornment, FormControl, InputLabel, IconButton, OutlinedInput } from '@mui/material';

// Material UI Icon Imports
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import styles from './PasswordForm.module.scss';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';

const cx = classnames.bind(styles);

function PasswordForm({ params }) {
    // const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    const navigate = useNavigate();

    const [error, setError] = useState('');

    //Inputs
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handles Display and Hide Password
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    // Handles Display and Hide Confirm Password
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleSave = async () => {
        if (passwordInput !== confirmPasswordInput) {
            setError('Mật khẩu không trùng khớp!');
        } else {
            if (params) {
                try {
                    const response = await httpRequest.post('/user/reset-password', {
                        token: params.token,
                        newPassword: passwordInput,
                    });
                    if (response.status === 200) {
                        navigate('/login');
                    }
                } catch (error) {
                    setError(error.response.data.message);
                }
            } else {
                try {
                    const response = await httpRequest.put('/user/change-password', {
                        newPassword: passwordInput,
                    });
                    if (response.status === 200) {
                        toast.success(
                            <div>
                                Đổi mật khẩu thành công <br /> Trở về trang chủ sau 2s
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
                        setTimeout(() => {
                            navigate('/');
                        }, 2000);
                    }
                } catch (error) {
                    setError(error.response.data.message);
                }
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && confirmPasswordInput && passwordInput) {
            event.preventDefault(); // Ngừng hành động mặc định của Enter
            handleSave();
        }
    };

    return (
        <div className={cx('login-inner')} onKeyDown={handleKeyDown}>
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
                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu mới</InputLabel>
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
                    label="Mật khẩu mới"
                    value={passwordInput}
                    onChange={(event) => {
                        setPasswordInput(event.target.value);
                    }}
                />
            </FormControl>
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
                <InputLabel htmlFor="outlined-adornment-confirm-password">Xác nhận mật khẩu</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={showPassword ? 'hide the password' : 'display the password'}
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownConfirmPassword}
                                onMouseUp={handleMouseUpConfirmPassword}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Xác nhận mật khẩu"
                    value={confirmPasswordInput}
                    onChange={(event) => {
                        setConfirmPasswordInput(event.target.value);
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
                className={cx('save-btn', {
                    disabled: !confirmPasswordInput || !passwordInput,
                })}
                onClick={() => handleSave()}
            >
                Lưu
            </Button>
            <ToastContainer />
        </div>
    );
}

export default PasswordForm;
