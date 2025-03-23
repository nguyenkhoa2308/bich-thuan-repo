import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './Addresses.module.scss';
import Button from '~/components/Button';
import AddressDialog from '~/components/Dialog/AddressDialog';
import ConfirmDialog from '~/components/Dialog/ConfirmDialog';
import httpRequest from '~/utils/httpRequest';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import { useAddress } from '~/contexts/AddressContext';

const cx = classnames.bind(styles);

function Addresses() {
    // const [addresses, setAddresses] = useState([]);
    const { addresses, getAddresses, deleteAddress } = useAddress();

    const [currentAddress, setCurrentAddress] = useState({});
    const [addressId, setAddressId] = useState();
    const [typeAction, setTypeAction] = useState('');
    const [updated, setUpdated] = useState(false);

    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    useEffect(() => {
        if (!updated) return;
        getAddresses();
        setUpdated(false);
    }, [updated, getAddresses]);

    function formatPhoneNumber(phone) {
        if (!phone.startsWith('0')) return phone; // Nếu không bắt đầu bằng 0, trả về nguyên gốc

        const newPrefix = '+84';
        const formattedNumber = phone.slice(0); // Thay 0 đầu tiên bằng +84

        return `(${newPrefix}) ${formattedNumber.slice(1, 4)} ${formattedNumber.slice(4, 7)} ${formattedNumber.slice(
            7,
        )}`;
    }

    const handleAdd = () => {
        setIsAddressDialogOpen(true);
        setTypeAction('add');
        setCurrentAddress({});
    };

    const handleUpdate = (addressId) => {
        setIsAddressDialogOpen(true);
        setTypeAction('update');

        const address = addresses.find((address) => address._id === addressId);

        setCurrentAddress(address);

        // console.log(address);
    };

    const handleDelete = async (id) => {
        setIsConfirmDialogOpen(false);

        const response = await deleteAddress(id);

        if (response.status === 200) {
            toast.success('Xóa địa chỉ thành công!', {
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
            setUpdated(true);
        } else {
            toast.error(
                <div>
                    Xóa địa chỉ thất bại! <br /> {response.response.data.message}
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
    };

    const handleSetDefault = async (id) => {
        try {
            const response = await httpRequest.post(`/address/set-default/${id}`);
            console.log(response);

            if (response.status === 200) {
                toast.success('Đặt đỉa chỉ mặc định thành công!', {
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
                setUpdated(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('address-heading')}>
                    <h1 className={cx('heading-title')}>Địa chỉ của tôi</h1>
                    <Button
                        primary
                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        className={cx('add-btn')}
                        onClick={() => handleAdd()}
                    >
                        Thêm địa chỉ mới
                    </Button>
                </div>
                <div className={cx('address-body')}>
                    <div className={cx('address-container')}>
                        {addresses?.length === 0 ? (
                            <div className={cx('address-empty')}>Bạn chưa có địa chỉ nào</div>
                        ) : (
                            <>
                                <div className={cx('address-title')}>Địa chỉ</div>
                                {addresses?.map((address, index) => {
                                    return (
                                        <div className={cx('address-row')} key={index}>
                                            <div className={cx('address-header', 'd-flex')}>
                                                <div className={cx('receiver-info')}>
                                                    <span className={cx('receiver-name')}>{address.fullName}</span>
                                                    <span className={cx('receiver-phone')}>
                                                        {formatPhoneNumber(address.phone)}
                                                    </span>
                                                </div>
                                                <div className={cx('header-action', 'd-flex')}>
                                                    <div
                                                        className={cx('update-action')}
                                                        onClick={() => handleUpdate(address._id)}
                                                    >
                                                        Cập nhật
                                                    </div>
                                                    {!address.isDefault && (
                                                        <div
                                                            className={cx('remove-action')}
                                                            onClick={() => {
                                                                setAddressId(address._id);
                                                                setIsConfirmDialogOpen(true);
                                                            }}
                                                        >
                                                            Xóa
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={cx('address-content')}>
                                                <div className={cx('address-info')}>
                                                    <div className={cx('address-detail')}>{address.detailAddress}</div>
                                                    <div
                                                        className={cx('address-location')}
                                                    >{`${address.ward}, ${address.district}, ${address.city}`}</div>
                                                </div>

                                                <Button
                                                    outline
                                                    onClick={() => handleSetDefault(address._id)}
                                                    className={cx({
                                                        'disable-btn': address.isDefault,
                                                    })}
                                                    disabled={address.isDefault}
                                                >
                                                    Thiết lập mặc định
                                                </Button>
                                            </div>

                                            {address.isDefault && (
                                                <div className={cx('default-label-container')}>
                                                    <span className={cx('default-label')}>Mặc định</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <AddressDialog
                typeAction={typeAction}
                currentAddress={currentAddress}
                isOpen={isAddressDialogOpen}
                onClose={() => setIsAddressDialogOpen(false)}
                onConfirm={() => {
                    setIsAddressDialogOpen(false);
                    setTimeout(() => setUpdated(true), 100); // Đợi dialog đóng hẳn rồi mới fetch API
                }}
                setUpdated={setUpdated}
            />

            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={() => handleDelete(addressId)}
                title="Bạn chắc chắn muốn xóa địa chỉ này?"
            />
            <ToastContainer />
        </div>
    );
}

export default Addresses;
