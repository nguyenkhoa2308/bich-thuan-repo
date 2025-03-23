import classnames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';

// Material UI Imports
import {
    TextField,
    InputLabel,
    InputAdornment,
    FormControl,
    FormControlLabel,
    IconButton,
    OutlinedInput,
    Radio,
    RadioGroup,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

// Material UI Icon Imports
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import styles from './RegisterForm.module.scss';
import Button from '~/components/Button';
import * as authService from '~/services/authService';

const cx = classnames.bind(styles);

function RegisterForm() {
    const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //Inputs
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [gender, setGender] = useState(false);
    const [birthdayInput, setBirthdayInput] = useState(null);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [isDefaultSet, setIsDefaultSet] = useState(false); // Cờ để kiểm tra nếu giá trị mặc định đã được gán
    const [errorMessage, setErrorMessage] = useState('');

    const handleOpen = () => {
        if (!isDefaultSet) {
            setBirthdayInput(dayjs()); // Gán giá trị mặc định là ngày hiện tại
            setIsDefaultSet(true); // Đánh dấu đã gán giá trị
        }
    };

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

    const handleRegister = async () => {
        // Gọi API để đăng ký
        const formattedDate = dayjs(birthdayInput).format('DD/MM/YYYY');

        if (!isEmail(emailInput)) {
            setErrorMessage('Email không đúng định dạng');
            return;
        } else {
            setErrorMessage('');
        }

        if (dayjs(birthdayInput).isAfter(dayjs(), 'day')) {
            setErrorMessage('Ngày sinh phải trước ngày hiện tại.');
            return;
        } else {
            setErrorMessage('');
        }

        if (passwordInput === confirmPasswordInput) {
            const res = await authService.register(
                emailInput,
                passwordInput,
                firstName,
                lastName,
                gender,
                formattedDate,
            );

            if (res.EC === 1) {
                setErrorMessage(res.EM);
            } else {
                console.log('Success');
                navigate('/login');
                setErrorMessage('');
            }
        } else {
            setErrorMessage('Mật khẩu không khớp');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content-inner')}>
                    <TextField
                        label="Họ"
                        value={lastName}
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
                            setLastName(event.target.value);
                        }}
                    />
                    <TextField
                        label="Tên"
                        value={firstName}
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
                            setFirstName(event.target.value);
                        }}
                    />
                    <FormControl sx={{ mb: 2 }}>
                        <RadioGroup
                            row
                            aria-labelledby="radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            // value={gender}
                        >
                            <FormControlLabel
                                value="female"
                                control={
                                    <Radio
                                        sx={{
                                            '.MuiSvgIcon-root': {
                                                // fontSize: '1.8rem',
                                                width: '2.4rem',
                                                height: '2.4rem',
                                            },
                                            '&.Mui-checked': {
                                                color: '#323232',
                                            },
                                        }}
                                    />
                                }
                                label="Nữ"
                                slotProps={{
                                    typography: {
                                        fontSize: '1.3rem',
                                        fontFamily: 'var(--font-family)',
                                        color: 'var(--shop-color-text)',
                                    },
                                }}
                                onChange={() => setGender(false)}
                            />
                            <FormControlLabel
                                value="male"
                                control={
                                    <Radio
                                        sx={{
                                            '.MuiSvgIcon-root': {
                                                // fontSize: '1.8rem',
                                                width: '2.4rem',
                                                height: '2.4rem',
                                            },
                                            '&.Mui-checked': {
                                                color: '#323232',
                                            },
                                        }}
                                    />
                                }
                                label="Nam"
                                slotProps={{
                                    typography: {
                                        fontSize: '1.3rem',
                                        fontFamily: 'var(--font-family)',
                                        color: 'var(--shop-color-text)',
                                    },
                                }}
                                onChange={() => setGender(true)}
                            />
                            {/* <FormControlLabel
                                value="other"
                                control={
                                    <Radio
                                        sx={{
                                            '.MuiSvgIcon-root': {
                                                // fontSize: '1.8rem',
                                                width: '2.4rem',
                                                height: '2.4rem',
                                            },
                                            '&.Mui-checked': {
                                                color: '#323232',
                                            },
                                        }}
                                    />
                                }
                                label="Other"
                                slotProps={{
                                    typography: {
                                        fontSize: '1.3rem',
                                        fontFamily: 'var(--font-family)',
                                        color: 'var(--shop-color-text)',
                                    },
                                }}
                            /> */}
                        </RadioGroup>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Ngày sinh"
                            format="DD/MM/YYYY"
                            sx={{
                                width: '100%',
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
                            slotProps={{
                                popper: {
                                    placement: 'auto-end',
                                    sx: {
                                        '.MuiTypography-root, .MuiPickersDay-root, .MuiPickersCalendarHeader-labelContainer':
                                            {
                                                fontSize: '1.2rem', // Font size cho ngày
                                                fontFamily: 'var(--font-family)',
                                                fontWeight: '500',
                                            },
                                        '.MuiPickersCalendarHeader-labelContainer': {
                                            fontSize: '1.4rem',
                                        },
                                    },
                                },
                            }}
                            // defaultValue={dayjs()}
                            value={birthdayInput}
                            onOpen={handleOpen}
                            onChange={(newBirthday) => setBirthdayInput(newBirthday)}
                        />
                    </LocalizationProvider>
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
                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
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
                            label="Mật khẩu"
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
                        <InputLabel htmlFor="outlined-adornment-confirm-password">Nhập lại mật khẩu</InputLabel>
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
                    {errorMessage !== '' && (
                        <div className={cx('error-container')}>
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            <span className={cx('error-message')}>{errorMessage}</span>
                        </div>
                    )}
                    <div className={cx('action-container')}>
                        <Button
                            primary
                            xLarge
                            className={cx('register-btn', {
                                disabled: !emailInput || !passwordInput || !confirmPasswordInput,
                            })}
                            onClick={() => handleRegister()}
                        >
                            Đăng ký
                        </Button>
                        <p className={cx('login-text')}>
                            Bạn đã có tài khoản?{' '}
                            <Link to="/login" className={cx('login-link')}>
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
