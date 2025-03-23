import classnames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

import axios from 'axios';

import styles from './AddressDialog.module.scss';
import Button from '~/components/Button';
import { useAddress } from '~/contexts/AddressContext';

const cx = classnames.bind(styles);

function AddressDialog({ typeAction, isOpen, onClose, onConfirm, currentAddress }) {
    const { createAddress, updateAddress } = useAddress();

    const [title, setTitle] = useState('');
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [formState, setFormState] = useState({
        fullName: '',
        detailAddress: '',
        phoneNumber: '',
        city: '',
        district: '',
        ward: '',
    });
    const [addressType, setAddressType] = useState(null);
    const [isDefault, setIsDefault] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json',
                );
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!isOpen) return; // Chỉ chạy khi dialog mở

        if (typeAction === 'add') {
            setTitle('Địa chỉ mới');
        } else if (typeAction === 'update') {
            setTitle('Cập nhật địa chỉ');
        }

        if (!currentAddress || cities.length === 0) return;

        // Tìm city
        const foundCity = cities.find((city) => city.Name === currentAddress.city);
        if (!foundCity) return;

        setSelectedCity(foundCity.Id);
        setDistricts(foundCity.Districts);

        // Tìm district
        const foundDistrict = foundCity.Districts.find((d) => d.Name === currentAddress.district);
        if (!foundDistrict) return;

        setSelectedDistrict(foundDistrict.Id);
        setWards(foundDistrict.Wards);

        // Tìm ward
        const foundWard = foundDistrict.Wards.find((w) => w.Name === currentAddress.ward);
        if (foundWard) {
            setSelectedWard(foundWard.Id);
        }

        setFormState({
            fullName: currentAddress.fullName,
            detailAddress: currentAddress.detailAddress,
            phoneNumber: currentAddress.phone,
            city: currentAddress.city,
            district: currentAddress.district,
            ward: currentAddress.ward,
        });
        setAddressType(currentAddress.typeAddress);
        setIsDefault(currentAddress.isDefault);
    }, [isOpen, typeAction, cities, currentAddress]);

    function deleteError(name) {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });

        deleteError(name);
    };

    const handleCityChange = (event) => {
        const selectedCityId = event.target.value;
        setSelectedCity(selectedCityId);

        const selectedCityData = cities.find((city) => city.Id === selectedCityId) || null;

        setFormState({
            ...formState,
            city: selectedCityData ? selectedCityData.Name : '', // Đảm bảo không bị lỗi undefined
        });

        setDistricts(selectedCityData ? selectedCityData.Districts : []);
        setWards([]);

        deleteError('city');
    };

    const handleDistrictChange = (event) => {
        const selectedDistrictId = event.target.value;
        setSelectedDistrict(selectedDistrictId);

        const selectedDistrictData = districts.find((district) => district.Id === selectedDistrictId) || null;

        setFormState({
            ...formState,
            district: selectedDistrictData ? selectedDistrictData.Name : '', // Tránh lỗi undefined
        });

        setWards(selectedDistrictData ? selectedDistrictData.Wards : []);
        deleteError('district');
    };

    const handleWardChange = (event) => {
        const selectedWardId = event.target.value;
        setSelectedWard(selectedWardId);

        const selectedWardData = wards.find((ward) => ward.Id === selectedWardId) || null;

        setFormState({
            ...formState,
            ward: selectedWardData ? selectedWardData.Name : '', // Tránh lỗi undefined
        });

        deleteError('ward');
    };

    const validateForm = (values) => {
        let errors = {};
        // Họ tên không được để trống
        if (!values.fullName) {
            errors.fullName = 'Họ tên người nhận là bắt buộc';
        }
        if (!values.detailAddress) {
            errors.detailAddress = 'Địa chỉ là bắt buộc';
        }
        const phoneRegExp = /^(\+84|0[3|5|7|8|9])([0-9]{8})\b/;
        if (!values.phoneNumber) {
            errors.phoneNumber = 'Số điện thoại là bắt buộc';
        } else if (!phoneRegExp.test(values.phoneNumber)) {
            errors.phoneNumber = 'Số điện thoại không đúng định dạng';
        }
        if (!values.city) {
            errors.city = 'Vui lòng chọn tỉnh/thành phố';
        }
        if (!values.district) {
            errors.district = 'Vui lòng chọn quận/huyện';
        }
        if (!values.ward) {
            errors.ward = 'Vui lòng chọn xã phường';
        }
        return errors;
    };

    const handleSelectOption = (e, type) => {
        e.preventDefault();
        setAddressType((prevType) => (prevType === type ? null : type));
    };

    const resetToDefault = () => {
        setAddressType(null);
        setIsDefault(false);
        setSelectedCity('');
        setSelectedDistrict('');
        setSelectedWard('');
        setFormState({});
        setErrors({});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm(formState);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);
            if (typeAction === 'add') {
                try {
                    const response = await createAddress(
                        formState.fullName,
                        formState.phoneNumber,
                        formState.city,
                        formState.district,
                        formState.ward,
                        formState.detailAddress,
                        addressType,
                        isDefault,
                    );

                    if (response.status === 200) {
                        setTimeout(() => {
                            setLoading(false);
                            onConfirm();
                            resetToDefault();
                        }, 1000);
                    }
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            } else if (typeAction === 'update') {
                try {
                    const response = await updateAddress(
                        currentAddress._id,
                        formState.fullName,
                        formState.phoneNumber,
                        formState.city,
                        formState.district,
                        formState.ward,
                        formState.detailAddress,
                        addressType,
                        isDefault,
                    );

                    if (response.status === 200) {
                        setTimeout(() => {
                            setLoading(false);
                            onConfirm();
                            resetToDefault();
                        }, 1000);
                    }
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            }
        }
    };

    const handleClose = () => {
        resetToDefault();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className={cx('modal-overlay', {
                show: isOpen,
            })}
        >
            <div className={cx('modal-content')}>
                <h3 className={cx('title')}>{title}</h3>
                <div className={cx('modal-form')}>
                    <form className={cx('billing-details')}>
                        <div className={cx('firstName')}>
                            <label htmlFor="firstName" className="form-label">
                                Họ tên người nhận<span className={cx('required')}>*</span>
                            </label>
                            <input
                                className={cx('first-name', 'form-control')}
                                id="firstName"
                                type="text"
                                name="fullName"
                                placeholder="Nhập tên người nhận"
                                value={formState.fullName}
                                onChange={handleInputChange}
                            />
                            {errors.fullName && <p className={cx('error-message')}>{errors.fullName}</p>}
                        </div>
                        <div className={cx('phone-number')}>
                            <label className="form-label">
                                Số điện thoại<span className={cx('required')}>*</span>
                            </label>
                            <input
                                className={cx('phone-num', 'form-control')}
                                placeholder="+84xxxxxxxxx"
                                type="text"
                                name="phoneNumber"
                                value={formState.phoneNumber}
                                onChange={handleInputChange}
                            />
                            {errors.phoneNumber && <p className={cx('error-message')}>{errors.phoneNumber}</p>}
                        </div>
                        <div className={cx('select-address')}>
                            <div className={cx('country')}>
                                <label htmlFor="coun" className="form-label">
                                    Tỉnh / Thành phố<span className={cx('required')}>*</span>
                                </label>
                                <select
                                    id="coun"
                                    className={cx('form-select', 'select-placeholder')}
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                >
                                    <option value="" className={cx('option')}>
                                        Chọn tỉnh/thành phố
                                    </option>
                                    {cities.map((city) => (
                                        <option key={city.Id} value={city.Id} className={cx('option')}>
                                            {city.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.city && <p className={cx('error-message')}>{errors.city}</p>}
                            </div>
                            <div className={cx('district')}>
                                <label className="form-label">
                                    Quận / Huyện<span className={cx('required')}>*</span>
                                </label>
                                <select
                                    id="reg-district"
                                    className={cx('form-select', 'select-placeholder')}
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                >
                                    <option value="" className={cx('option')}>
                                        Chọn quận / huyện
                                    </option>
                                    {districts.map((district) => (
                                        <option key={district.Id} value={district.Id} className={cx('option')}>
                                            {district.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && <p className={cx('error-message')}>{errors.district}</p>}
                            </div>
                            <div className={cx('street')}>
                                <label className="form-label">
                                    Phường / Xã<span className={cx('required')}>*</span>
                                </label>
                                <select
                                    id="ward"
                                    className={cx('form-select', 'select-placeholder')}
                                    value={selectedWard}
                                    onChange={handleWardChange}
                                >
                                    <option value="" className={cx('option')}>
                                        Chọn Phường/Xã
                                    </option>
                                    {wards.map((ward) => (
                                        <option key={ward.Id} value={ward.Id} className={cx('option')}>
                                            {ward.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.ward && <p className={cx('error-message')}>{errors.ward}</p>}
                            </div>
                        </div>
                        <div className={cx('detail-address')}>
                            <label className="form-label">
                                Địa chỉ chi tiết<span className={cx('required')}>*</span>
                            </label>
                            <input
                                className={cx('street-add', 'form-control')}
                                placeholder="Số nhà hoặc tên đường"
                                type="text"
                                name="detailAddress"
                                value={formState.detailAddress}
                                onChange={handleInputChange}
                            />
                            {errors.detailAddress && <p className={cx('error-message')}>{errors.detailAddress}</p>}
                        </div>
                        <div className={cx('type-address')}>
                            <label className="form-label">Loại địa chỉ</label>
                            <div>
                                <Button
                                    className={cx('address-optional', {
                                        active: addressType === 'home',
                                    })}
                                    onClick={(e) => handleSelectOption(e, 'home')}
                                >
                                    Nhà riêng
                                </Button>
                                <Button
                                    className={cx('address-optional', {
                                        active: addressType === 'office',
                                    })}
                                    onClick={(e) => handleSelectOption(e, 'office')}
                                >
                                    Văn phòng
                                </Button>
                            </div>
                        </div>
                        <div className={cx('set-default-address')}>
                            <Form.Group className={cx('form-group')}>
                                <label className={cx('form-default-address', 'd-flex', 'align-items-center')}>
                                    <Form.Check
                                        type="checkbox"
                                        checked={isDefault}
                                        disabled={currentAddress.isDefault}
                                        onChange={() => setIsDefault(!isDefault)}
                                        className={cx('custom-checkbox')}
                                    />
                                    <span className={cx('label-text')}>Đặt làm địa chỉ mặc định</span>
                                </label>
                            </Form.Group>
                        </div>
                    </form>
                </div>
                <div className={cx('modal-action')}>
                    <button className={cx('cancel')} onClick={() => handleClose()}>
                        Trở lại
                    </button>
                    <button className={cx('remove')} onClick={(e) => handleSubmit(e)}>
                        {loading ? <Spinner animation="border" className="mt-3" /> : <span> Hoàn thành</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddressDialog;
