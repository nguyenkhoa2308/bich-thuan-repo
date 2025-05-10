import classnames from 'classnames/bind'
import { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { Zoom, toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import styles from './Profile.module.scss'
import { AuthContext } from '~/contexts/AuthContext'
import httpRequest from '~/utils/httpRequest'
import Button from '~/components/Button'
import { Spinner } from 'react-bootstrap'

const cx = classnames.bind(styles)

function Profile() {
    const { auth, setAuth } = useContext(AuthContext)
    // eslint-disable-next-line
    const navigate = useNavigate()
    const [user, setUser] = useState()
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [gender, setGender] = useState('')
    const [birthdayInput, setBirthdayInput] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    const fileInputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState('')

    const [loading, setLoading] = useState(false)

    const userId = auth.user.id

    const handleChange = (event) => {
        setGender(event.target.value)
        console.log(auth)
    }

    const handleSubmit = async (firstName, lastName, displayName, gender, birthdayInput) => {
        const formData = new FormData()

        if (dayjs(birthdayInput).isAfter(dayjs(), 'day')) {
            setErrorMessage('Ngày sinh phải trước ngày hiện tại.')
            return
        } else {
            setErrorMessage('')
        }

        formData.append('firstName', firstName)
        formData.append('lastName', lastName)
        formData.append('displayName', displayName)
        formData.append('gender', gender === 'male' ? true : false)
        formData.append('birthDate', dayjs(birthdayInput).format('DD/MM/YYYY'))

        if (fileInputRef.current.files[0]) {
            formData.append('avatar', fileInputRef.current.files[0])
            setLoading(true)
        }

        try {
            const response = await httpRequest.put('/user/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Quan trọng khi gửi FormData
                },
            })

            // Xử lý phản hồi ở đây
            if (response.EC === 0) {
                console.log('Success')
                localStorage.setItem('access_token', response.access_token)
                setAuth({
                    isAuthenticated: true,
                    user: {
                        id: response?.user?._id ?? '',
                        email: response?.user?.email ?? '',
                        name: response?.user?.displayName ?? '',
                        role: response?.user?.role ?? '',
                        avatar: response?.user?.avatar ?? '',
                    },
                })

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
                })
            } else {
                console.log('Error')
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
                })
            }
        } catch (error) {
            console.error('Có lỗi khi gửi yêu cầu:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageClick = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const isValidType = ['image/jpeg', 'image/png'].includes(file.type)
        const isValidSize = file.size <= 1024 * 1024

        if (!isValidType) {
            alert('Chỉ chấp nhận định dạng .JPEG hoặc .PNG')
            return
        }

        if (!isValidSize) {
            alert('Dung lượng ảnh phải nhỏ hơn hoặc bằng 1MB')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewUrl(reader.result)
        }
        reader.readAsDataURL(file)
    }

    useEffect(() => {
        const fetchUser = async () => {
            const response = await httpRequest.get(`/user/getUserById/${userId}`)
            setUser(response)
            setPreviewUrl(response.avatar)
        }
        if (userId) {
            fetchUser()
        }
    }, [userId])

    useEffect(() => {
        if (user) {
            setLastName(user.lastName || '')
            setFirstName(user.firstName || '')
            setDisplayName(user.displayName || '')
            setGender(user.gender ? 'male' : 'female')
            setBirthdayInput(dayjs(user.birthDate, 'DD/MM/YYYY'))
        }
    }, [user])

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('profile-heading')}>
                    <h1 className={cx('heading-title')}>Hồ Sơ Của Tôi</h1>
                    <div className={cx('heading-subtitle')}>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
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
                                {loading ? <Spinner animation="border" /> : 'Lưu'}
                            </Button>
                        </div>
                    </div>
                    <div className={cx('upload-container', 'd-flex', 'justify-content-center')}>
                        <div className={cx('upload-wrapper', 'd-flex', 'flex-column', 'align-items-center')}>
                            <div
                                className={cx(
                                    'upload-header',
                                    'd-flex',
                                    'justify-content-center',
                                    'align-items-center',
                                )}
                            >
                                <div
                                    className={cx('upload-preview')}
                                    style={{
                                        backgroundImage: `url(${previewUrl})`,
                                    }}
                                ></div>
                            </div>
                            <input
                                className={cx('upload-input')}
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <button type="button" className={cx('upload-btn')} onClick={handleImageClick}>
                                Chọn ảnh
                            </button>

                            <div className={cx('upload-info')}>
                                <div className={cx('upload-note')}>Dung lượng file tối đa 1 MB</div>
                                <div className={cx('upload-note')}>Định dạng: .JPEG, .PNG</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
