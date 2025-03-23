import classnames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
// Material UI Imports
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import styles from './ListAddressesDialog.module.scss';
import { useAddress } from '~/contexts/AddressContext';
import Button from '~/components/Button';

const cx = classnames.bind(styles);

function ListAddressesDialog({
    isOpen,
    onClose,
    onConfirm,
    setTypeAction,
    setIsAddressDialogOpen,
    setUpdateAddress,
    currentAddress,
    setCurrentAddress,
}) {
    const { addresses } = useAddress();
    const [selectedAddress, setSelectedAddress] = useState();

    const handleConfirm = () => {
        const address = addresses.find((address) => address._id === selectedAddress);

        setCurrentAddress(address);
        onConfirm();
    };

    useEffect(() => {
        if (currentAddress) {
            setSelectedAddress(currentAddress._id);
        }
    }, [currentAddress]);

    const handleClose = () => {
        // resetToDefault();
        onClose();
    };

    const handleUpdateBtn = (address) => {
        setTypeAction('update');
        setUpdateAddress(address);
        setIsAddressDialogOpen(true);
        onClose();
    };

    const handleAdd = () => {
        setTypeAction('add');
        setUpdateAddress({});
        setIsAddressDialogOpen(true);
        onClose();
    };

    function formatPhoneNumber(phone) {
        if (!phone.startsWith('0')) return phone; // Nếu không bắt đầu bằng 0, trả về nguyên gốc

        const newPrefix = '+84';
        const formattedNumber = phone.slice(0); // Thay 0 đầu tiên bằng +84

        return `(${newPrefix}) ${formattedNumber.slice(1, 4)} ${formattedNumber.slice(4, 7)} ${formattedNumber.slice(
            7,
        )}`;
    }

    if (!isOpen) return null;

    return (
        <div
            className={cx('modal-overlay', {
                show: isOpen,
            })}
        >
            <div className={cx('modal-content')}>
                <div className={cx('dialog-container')}>
                    <div className={cx('dialog-header')}>Địa chỉ của tôi</div>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={selectedAddress} // Lưu địa chỉ được chọn
                            onChange={(e) => setSelectedAddress(e.target.value)} // Cập nhật khi chọn
                        >
                            {addresses.map((address, index) => (
                                <FormControlLabel
                                    key={address._id || index} // Dùng address.id nếu có, tránh dùng index
                                    value={address._id} // Gán ID làm giá trị radio
                                    control={
                                        <Radio
                                            sx={{
                                                '.MuiSvgIcon-root': {
                                                    width: '2.4rem',
                                                    height: '2.4rem',
                                                },
                                                '&.Mui-checked': {
                                                    color: 'var(--primary)',
                                                },
                                            }}
                                            className={cx('list-item')}
                                        />
                                    }
                                    className={cx('list-container')}
                                    label={
                                        <div className={cx('shipping-address__details')}>
                                            <div className={cx('address-details-left')}>
                                                <div className={cx('receiver-info')}>
                                                    <span className={cx('receiver-name')}>{address.fullName}</span>
                                                    <span className={cx('receiver-phone')}>
                                                        {formatPhoneNumber(address.phone)}
                                                    </span>
                                                </div>
                                                <div className={cx('address-info')}>
                                                    <div className={cx('address-detail')}>{address.detailAddress}</div>
                                                    <div className={cx('address-location')}>
                                                        {`${address.ward}, ${address.district}, ${address.city}`}
                                                    </div>
                                                </div>
                                                {address.isDefault && (
                                                    <div className={cx('default-label-container')}>
                                                        <span className={cx('default-label')}>Mặc định</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={cx('address-details-right')}>
                                                <Button
                                                    className={cx('update-btn')}
                                                    onClick={() => handleUpdateBtn(address)}
                                                >
                                                    Cập nhật
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    sx={{
                                        '.MuiFormControlLabel-label': {
                                            width: '100%',
                                        },
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <Button
                        outline
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        className={cx('add-btn')}
                        onClick={() => handleAdd()}
                    >
                        Thêm địa chỉ mới
                    </Button>
                </div>

                <div className={cx('modal-action')}>
                    <button className={cx('cancel')} onClick={() => handleClose()}>
                        Trở lại
                    </button>
                    <button className={cx('confirm')} onClick={() => handleConfirm()}>
                        {/* {loading ? <Spinner animation="border" className="mt-3" /> : <span> Hoàn thành</span>} */}
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListAddressesDialog;
