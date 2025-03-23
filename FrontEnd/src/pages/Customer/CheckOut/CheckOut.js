import classNames from 'classnames/bind';
import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faLocationDot, faPlus } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line
import { ToastContainer, toast, Zoom } from 'react-toastify';

import styles from './CheckOut.module.scss';
import { CartContext } from '~/contexts/CartContext';
import Button from '~/components/Button';
import httpRequest from '~/utils/httpRequest';
import { useAddress } from '~/contexts/AddressContext';
import ListAddressesDialog from '~/components/Dialog/ListAddressesDialog';
import AddressDialog from '~/components/Dialog/AddressDialog';
import { useNavigate } from 'react-router-dom';

// import AddressDialog from '~/components/Dialog/AddressDialog';

const cx = classNames.bind(styles);

export default function CheckOut() {
    const { cartItems, getCart } = useContext(CartContext);
    const { addresses, getAddresses } = useAddress();

    const navigate = useNavigate();

    const [updateAddress, setUpdateAddress] = useState({});
    const [currentAddress, setCurrentAddress] = useState({});
    const [updated, setUpdated] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false); // Dialog chỉnh sửa
    const [typeAction, setTypeAction] = useState(''); // Hành động (edit/add)

    const [isBanking, setIsBanking] = useState(1);
    const [note, setNote] = useState('');

    function formatPhoneNumber(phone) {
        if (!phone?.startsWith('0')) return phone; // Nếu không bắt đầu bằng 0, trả về nguyên gốc

        const newPrefix = '+84';
        const formattedNumber = phone.slice(0); // Thay 0 đầu tiên bằng +84

        return `(${newPrefix}) ${formattedNumber.slice(1, 4)} ${formattedNumber.slice(4, 7)} ${formattedNumber.slice(
            7,
        )}`;
    }

    useEffect(() => {
        if (!updated) return;

        getAddresses();

        setUpdated(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updated]);

    useEffect(() => {
        if (addresses.length > 0) {
            setCurrentAddress(addresses.find((address) => address.isDefault));
        }
    }, [addresses]);

    // const defaultAddress = addresses?.find((address) => address.isDefault === true);
    const handlePaymentMethodSelect = (method) => {
        setIsBanking(method);
    };

    const handleAdd = () => {
        setTypeAction('add');
        setUpdateAddress({});
        setIsAddressDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (isBanking === 1) {
            //Nếu người dùng chọn thanh toán chuyển khoản
            try {
                const response = await httpRequest.post('order/add', {
                    fullName: currentAddress.fullName,
                    items: cartItems?.items,
                    shippingAddress: currentAddress._id,
                    shippingFee: 0,
                    note: note,
                    banking: isBanking,
                });

                const link_payment = response.order.link_payment;
                window.location.href = link_payment;
            } catch (error) {
                console.error('Error creating orderId:', error);
            }
        } else {
            //Nếu người dùng chọn thanh toán khi nhận hàng
            try {
                const response = await httpRequest.post('order/add', {
                    fullName: currentAddress.fullName,
                    phone: currentAddress.phone,
                    items: cartItems?.items,
                    shippingAddress: currentAddress._id,
                    shippingFee: 0,
                    note: note,
                    banking: isBanking,
                });
                if (response.status === 200) {
                    toast.success(
                        <div>
                            Đặt hàng thành công! <br /> Quay về trang chủ sau 2s
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
                        getCart();
                    }, 2500);
                }
            } catch (error) {
                console.error('Error add to order', error);
            }
        }
    };

    return (
        <div className={cx('main-content', 'container')}>
            <ToastContainer />
            <div className={cx('main')}>
                <div className={cx('header')}>
                    <p className={cx('header-title')}>Thông tin giao hàng</p>
                </div>
                <div className={cx('row gy-4')}>
                    <div className={cx('col-12')}>
                        <div className={cx('shipping-address')}>
                            <h3 className={cx('shipping-address__header')}>
                                <FontAwesomeIcon icon={faLocationDot} className={cx('shipping-address__header-icon')} />
                                Địa chỉ nhận hàng
                            </h3>

                            {Object.keys(currentAddress).length !== 0 ? (
                                <div className={cx('shipping-address__details')}>
                                    <div className={cx('address-details-left')}>
                                        <div className={cx('receiver-info')}>
                                            <span className={cx('receiver-name')}>{currentAddress?.fullName}</span>
                                            <span className={cx('receiver-phone')}>
                                                {formatPhoneNumber(currentAddress?.phone)}
                                            </span>
                                        </div>
                                        <div className={cx('address-info')}>
                                            <div className={cx('address-detail')}>{currentAddress.detailAddress}</div>
                                            <div
                                                className={cx('address-location')}
                                            >{`${currentAddress.ward}, ${currentAddress.district}, ${currentAddress.city}`}</div>
                                        </div>

                                        {currentAddress.isDefault && (
                                            <div className={cx('default-label-container')}>
                                                <span className={cx('default-label')}>Mặc định</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={cx('address-details-right')}>
                                        <Button className={cx('change-btn')} onClick={() => setShowDialog(true)}>
                                            Thay đổi
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Button
                                        outline
                                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                        className={cx('add-btn', 'mt-3')}
                                        onClick={() => handleAdd()}
                                    >
                                        Thêm địa chỉ mới
                                    </Button>
                                </>
                            )}
                            <hr></hr>
                        </div>
                    </div>
                    <div className={cx('col-12')}>
                        <div className={cx('order-payment')}>
                            <div className={cx('inside-order-payment')}>
                                <h3>Sản phẩm của bạn</h3>
                                <div className={cx('your-order')}>
                                    <table className={cx('your-order-table', 'table')}>
                                        <thead>
                                            <tr>
                                                <th className="product-name">Sản phẩm</th>
                                                <th className="product-total">Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems &&
                                                cartItems?.items?.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        <tr className={cx('cart_item')}>
                                                            <td className={cx('product')}>
                                                                <div className={cx('product-thumbnail')}>
                                                                    <img
                                                                        className={cx('product-img')}
                                                                        src={item?.product?.image}
                                                                        alt={item?.product?.name}
                                                                    />
                                                                    <span
                                                                        className={cx('product-img-quantity')}
                                                                        aria-hidden="true"
                                                                    >
                                                                        {item?.quantity}
                                                                    </span>
                                                                </div>
                                                                <div className={cx('product-desc')}>
                                                                    <span className={cx('product-name')}>
                                                                        {item?.product?.name}
                                                                    </span>
                                                                    {item?.variant?.name !== 'default' ? (
                                                                        <span className={cx('product-variant')}>
                                                                            {item?.variant?.name}
                                                                        </span>
                                                                    ) : null}
                                                                </div>
                                                            </td>
                                                            <td className={cx('product-total')}>
                                                                <span>
                                                                    {new Intl.NumberFormat('en-US').format(
                                                                        item?.product?.priceFinal *
                                                                            item?.quantity *
                                                                            1000,
                                                                    )}
                                                                </span>
                                                                ₫
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>
                                                ))}
                                        </tbody>
                                        <tfoot>
                                            {cartItems && (
                                                <React.Fragment>
                                                    <tr className={cx('order-total')}>
                                                        <th>Tổng</th>
                                                        <td>
                                                            <strong>
                                                                {new Intl.NumberFormat('en-US').format(
                                                                    cartItems?.totalPriceFinal * 1000,
                                                                )}
                                                                ₫
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )}
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form className={cx('additional-information')}>
                        <div>
                            <h3 className={cx('additional-information-title')}>Thông tin thêm</h3>
                        </div>
                        <div>
                            <hr></hr>
                        </div>
                        <div className={cx('order-notes')}>
                            <label className={cx('order-notes-label')}>Thêm chú thích (Tùy chọn)</label>
                            <input
                                className={cx('order', 'form-control')}
                                type="text"
                                name="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </form>
                    <div className={cx('order-container')}>
                        <div>
                            <h3 className={cx('order-title')}>Chọn phương thức thanh toán</h3>
                        </div>
                        <form>
                            <input
                                type="radio"
                                name="payment"
                                id="local"
                                checked={isBanking === 1}
                                className={cx('local-check')}
                                onChange={() => handlePaymentMethodSelect(1)}
                            />
                            <input
                                type="radio"
                                name="payment"
                                id="payment-on-delivery"
                                checked={isBanking === 0}
                                className={cx('payment-on-delivery-check')}
                                onChange={() => handlePaymentMethodSelect(0)}
                            />
                            <div className={cx('category')}>
                                <label htmlFor="local" className={cx('local-bankMethod')}>
                                    <div className={cx('imgName')}>
                                        <div className={cx('imgContainer', 'local-bank')}>
                                            <img src="https://i.ibb.co/0K2tB6Q/qr-code-1.png" alt=""></img>
                                        </div>
                                        <span className="name">Chuyển khoản ngân hàng (Quét mã QR)</span>
                                    </div>
                                    <span className={cx('check')}>
                                        <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#6064b6' }} />
                                    </span>
                                </label>
                                <label htmlFor="payment-on-delivery" className={cx('payment-on-deliveryMethod')}>
                                    <div className={cx('imgName')}>
                                        <div className={cx('imgContainer', 'payment-on-delivery')}>
                                            <img
                                                src="https://i.ibb.co/M1WqwtQ/Pngtree-cash-on-delivery-bagde-olshop-6359688.png"
                                                alt=""
                                                border="0"
                                            ></img>
                                        </div>
                                        <span className="name">Thanh toán khi nhận hàng</span>
                                    </div>
                                    <span className={cx('check')}>
                                        <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#6064b6' }} />
                                    </span>
                                </label>
                            </div>
                        </form>
                        <div className={cx('order')}>
                            <Button
                                primary
                                className={cx('submit-btn')}
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Tiến hành đặt hàng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <ListAddressesDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onConfirm={() => setShowDialog(false)}
                setTypeAction={setTypeAction}
                setIsAddressDialogOpen={setIsAddressDialogOpen}
                setUpdateAddress={setUpdateAddress}
                currentAddress={currentAddress}
                setCurrentAddress={setCurrentAddress}
            />
            <AddressDialog
                typeAction={typeAction}
                currentAddress={updateAddress}
                isOpen={isAddressDialogOpen}
                onClose={() => {
                    setIsAddressDialogOpen(false);
                    if (Object.keys(currentAddress).length !== 0) {
                        setShowDialog(true);
                    }
                }}
                onConfirm={() => {
                    setIsAddressDialogOpen(false);
                    if (Object.keys(currentAddress).length !== 0) {
                        setShowDialog(true);
                    }
                    setTimeout(() => setUpdated(true), 100); // Đợi dialog đóng hẳn rồi mới fetch API
                }}
            />
        </div>
    );
}
