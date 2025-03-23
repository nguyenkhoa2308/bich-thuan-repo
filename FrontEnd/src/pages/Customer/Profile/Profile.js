import classnames from 'classnames/bind';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import styles from './Profile.module.scss';
import { AuthContext } from '~/contexts/AuthContext';
import httpRequest from '~/utils/httpRequest';
import Button from '~/components/Button';

const cx = classnames.bind(styles);

function Profile() {
    const { auth, setAuth } = useContext(AuthContext);
    // eslint-disable-next-line
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState('');
    const [birthdayInput, setBirthdayInput] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const userId = auth.user.id;

    const handleChange = (event) => {
        setGender(event.target.value);
        console.log(auth);
    };

    const handleSubmit = async (firstName, lastName, displayName, gender, birthdayInput) => {
        const formattedDate = dayjs(birthdayInput).format('DD/MM/YYYY');
        const formattedGender = gender === 'male' ? true : false;

        if (dayjs(birthdayInput).isAfter(dayjs(), 'day')) {
            setErrorMessage('Ngày sinh phải trước ngày hiện tại.');
            return;
        } else {
            setErrorMessage('');
        }

        const response = await httpRequest.put('/user/update', {
            firstName: firstName,
            lastName: lastName,
            displayName: displayName,
            gender: formattedGender,
            birthDate: formattedDate,
        });

        if (response.EC === 0) {
            console.log('Success');
            localStorage.setItem('access_token', response.access_token);
            setAuth({
                isAuthenticated: true,
                user: {
                    id: response?.updateUser?._id ?? '',
                    email: response?.updateUser?.email ?? '',
                    name: response?.updateUser?.displayName ?? '',
                    role: response?.updateUser?.role ?? '',
                },
            });
            // getCart();
            // navigate('/');
            toast.success('Sửa thông tin người dùng thành công!', {
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
        } else {
            console.log('Error');
            toast.error('Sửa thông tin người dùng thất bại!', {
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
    };

    useEffect(() => {
        const fetchUser = async () => {
            const response = await httpRequest.get(`/user/getUserById/${userId}`);
            setUser(response);
        };
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    useEffect(() => {
        if (user) {
            setLastName(user.lastName || '');
            setFirstName(user.firstName || '');
            setDisplayName(user.displayName || '');
            setGender(user.gender ? 'male' : 'female');
            setBirthdayInput(dayjs(user.birthDate, 'DD/MM/YYYY'));
        }
    }, [user]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('profile-heading')}>
                    <h1 className={cx('heading-title')}>Hồ Sơ Của Tôi</h1>
                </div>
                <div className={cx('profile-body')}>
                    <div className={cx('profile-container')}>
                        <div className={cx('profile-row')}>
                            <div className={cx('profile-label')}>Email</div>
                            <div className={cx('profile-input')}>{user?.email}</div>
                        </div>
                        <div className={cx('profile-row')}>
                            <div className={cx('profile-label')}>Họ</div>
                            <div className={cx('profile-input')}>
                                <input
                                    type="text"
                                    className={cx('input-field')}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('profile-row')}>
                            <div className={cx('profile-label')}>Tên</div>
                            <div className={cx('profile-input')}>
                                <input
                                    type="text"
                                    className={cx('input-field')}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('profile-row')}>
                            <div className={cx('profile-label')}>Tên hiển thị</div>
                            <div className={cx('profile-input')}>
                                <input
                                    type="text"
                                    className={cx('input-field')}
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('profile-row')}>
                            <div className={cx('profile-label')}>Giới tính</div>
                            <div className={cx('profile-input')}>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        aria-labelledby="radio-buttons-group-label"
                                        // defaultValue="female"
                                        name="radio-buttons-group"
                                        value={gender}
                                        onChange={handleChange}
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
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                        </div>
                        <div className={cx('profile-row')}>
                            <div className={cx('profile-label')}>Ngày sinh</div>
                            <div className={cx('profile-input')}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        sx={{
                                            width: '80%',
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
                                                placement: 'right-end',
                                                sx: {
                                                    '.MuiTypography-root, .MuiPickersDay-root, .MuiPickersCalendarHeader-labelContainer':
                                                        {
                                                            fontSize: '1.2rem', // Font size cho ngày
                                                            fontFamily: 'var(--font-family)',
                                                            fontWeight: '500',
                                                        },
                                                    '.MuiPickersCalendarHeader-labelContainer': {
                                                        fontSize: '1.4rem',
                                                        fontFamily: 'var(--font-family)',
                                                    },
                                                    '.MuiPickersYear-yearButton': {
                                                        fontSize: '1.2rem',
                                                        fontFamily: 'var(--font-family)',
                                                    },
                                                },
                                            },
                                        }}
                                        defaultValue={birthdayInput}
                                        value={birthdayInput}
                                        onChange={(newBirthday) => setBirthdayInput(newBirthday)}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        {errorMessage !== '' && (
                            <div className={cx('profile-row')}>
                                <div className={cx('profile-label')}>
                                    <div className={cx('error-container')}>
                                        <FontAwesomeIcon icon={faTriangleExclamation} />
                                        <span className={cx('error-message')}>{errorMessage}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={cx('profile-row')}>
                            <Button
                                primary
                                onClick={() => handleSubmit(firstName, lastName, displayName, gender, birthdayInput)}
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Profile;
