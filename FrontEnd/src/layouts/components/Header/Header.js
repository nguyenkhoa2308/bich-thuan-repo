import classnames from 'classnames/bind';
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faTrashCan, faUser } from '@fortawesome/free-regular-svg-icons';
import { MenuItem } from '@mui/material';
import { faAngleDown, faArrowRightFromBracket, faMinus, faPlus, faGauge } from '@fortawesome/free-solid-svg-icons';

import styles from './Header.module.scss';
import { AccountIcon, CartIcon, ClipBoardListIcon, ShoppingCartIcon } from '~/components/Icons/Icons';
import Button from '~/components/Button';
import Search from '../Search';
import DropDownMenu from '~/components/DropDownMenu';
import { AuthContext } from '~/contexts/AuthContext';
import { CartContext } from '~/contexts/CartContext';

const cx = classnames.bind(styles);

const HEADER_TAB = [
    { title: 'Sofa', slug: 'sofa' },
    { title: 'Bàn', slug: 'desk' },
    { title: 'Ghế', slug: 'chair' },
    { title: 'Giường', slug: 'beds' },
    // { title: 'Chăn ga gối', slug: 'bedding' },
    { title: 'Tủ kệ', slug: 'store-organization' },
    { title: 'Nội thất văn phòng', slug: 'office' },
    { title: 'Trang trí', slug: 'decor' },
    { title: 'Nhà bếp', slug: 'kitchen' },
    { title: 'Phòng tắm', slug: 'bathroom' },
];

function Header() {
    const { auth, setAuth } = useContext(AuthContext);
    const { cartItems, countItems, deleteCartItem, updateQuantityOfCartItem } = useContext(CartContext);
    const navigate = useNavigate();

    const slug = useParams();
    const location = useLocation();
    // eslint-disable-next-line
    const [activeTab, setActiveTab] = useState(-1);
    const [accountAnchorEl, setAccountAnchorEl] = useState(null);
    const [cartAnchorEl, setCartAnchorEl] = useState(null);
    const [accountOpen, setAccountOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartQuantities, setCartQuantities] = useState({});
    const [pendingUpdate, setPendingUpdate] = useState(null);

    const handleAccountClick = (event) => {
        setAccountAnchorEl(event.currentTarget);
        setAccountOpen(true);
    };

    const handleCartClick = (event) => {
        setCartAnchorEl(event.currentTarget);
        setCartOpen(true);
    };

    const handleClose = () => {
        setAccountOpen(false);
        setCartOpen(false);
    };

    const handleUpdate = (quantity, cartItemId) => {
        setCartQuantities((prev) => ({
            ...prev,
            [cartItemId]: quantity,
        }));

        // updateQuantityOfCartItem(quantity, cartItemId); // Gọi API để cập nhật số lượng
        setPendingUpdate({ cartItemId });
    };

    const handleIncreaseQuantity = (stock, quantity, cartItemId) => {
        const newQuantity = (cartQuantities[cartItemId] || quantity) + 1;

        // Chỉ tăng số lượng nếu newQuantity <= stock
        if (newQuantity <= stock) {
            handleUpdate(newQuantity, cartItemId); // Gọi API để cập nhật số lượng
        }
    };

    const handleDecreaseQuantity = (quantity, cartItemId) => {
        const currentQuantity = cartQuantities[cartItemId] || quantity;

        const newQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;

        // Chỉ giảm số lượng nếu newQuantity < currentQuantity
        if (newQuantity !== currentQuantity) {
            // Kiểm tra nếu số lượng thay đổi
            handleUpdate(newQuantity, cartItemId); // Gọi API để cập nhật số lượng
        }
    };

    const handleRemoveItem = (cartItem) => {
        // eslint-disable-next-line
        const delItemId = cartItem._id;
        delete cartItems.delItemId;
        deleteCartItem(cartItem._id);
    };

    // Dùng useEffect để gọi API sau 0.5s nếu không có thay đổi
    useEffect(() => {
        if (!pendingUpdate) return;

        const timer = setTimeout(() => {
            const { cartItemId } = pendingUpdate;
            updateQuantityOfCartItem(cartQuantities[cartItemId], cartItemId);
            setPendingUpdate(null);
        }, 500);

        return () => clearTimeout(timer);
    }, [pendingUpdate, cartQuantities, updateQuantityOfCartItem]);

    const USER_MENU = [
        {
            title: 'Thông tin tài khoản',
            icon: <FontAwesomeIcon icon={faUser} />,
            value: 'view-profile',
            clickAction: () => {
                navigate('/account');
            },
        },
        {
            title: 'Danh sách địa chỉ',
            icon: <FontAwesomeIcon icon={faAddressBook} />,
            value: 'address-list',
            clickAction: () => {
                navigate('/account/addresses');
            },
        },
        {
            title: 'Đơn mua',
            icon: <ClipBoardListIcon />,
            value: 'purchase',
            clickAction: () => {
                navigate('/account/purchase');
            },
        },
        ...(auth?.user?.role === 'admin'
            ? [
                  {
                      title: 'Trang Admin',
                      icon: <FontAwesomeIcon icon={faGauge} />, // Dùng icon phù hợp
                      to: '/admin',
                      value: 'admin',
                      clickAction: () => {
                          navigate('/admin');
                      },
                  },
              ]
            : []), // Nếu không phải admin, không thêm mục này
        {
            title: 'Đăng xuất',
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
            clickAction: () => {
                localStorage.removeItem('access_token');
                setAuth({
                    isAuthenticated: false,
                    user: {
                        id: '',
                        email: '',
                        name: '',
                        role: '',
                    },
                });
                setAccountOpen(false);
                navigate('/');
            },
            separate: true,
            value: 'logout',
        },
    ];

    useEffect(() => {
        if (location.pathname === '/') {
            // Kiểm tra nếu trang hiện tại là trang chủ
            setActiveTab(-1); // Đặt lại activeTab thành -1 khi về trang chủ
        }
        setAccountOpen(false);
        setCartOpen(false);
    }, [location.pathname]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('header-bar')}>
                    <Link to="/">
                        <span className={cx('header-logo')}>NinFurniture</span>
                    </Link>

                    <div className={cx('header-action')}>
                        <Search />
                        <div className={cx('header-action_account', 'header-action_item')}>
                            <div onClick={auth.isAuthenticated ? handleAccountClick : null}>
                                <Link className={cx('header-action_text')} to={auth.isAuthenticated ? null : '/login'}>
                                    <span className={cx('box-icon')}>
                                        <AccountIcon />
                                    </span>
                                    {auth.isAuthenticated ? (
                                        <span className={cx('box-text')}>
                                            Tài khoản của
                                            <span className={cx('text-blow')}>
                                                {auth.user.name}
                                                <FontAwesomeIcon icon={faAngleDown} className={cx('angle-down-icon')} />
                                            </span>
                                        </span>
                                    ) : (
                                        <span className={cx('box-text')}>
                                            Đăng nhập / Đăng ký
                                            <span className={cx('text-blow')}>Tài khoản của tôi</span>
                                        </span>
                                    )}
                                </Link>
                            </div>

                            <DropDownMenu
                                anchorEl={accountAnchorEl}
                                open={accountOpen}
                                handleClose={handleClose}
                                width={205}
                            >
                                {USER_MENU.map((item, index) => (
                                    <MenuItem
                                        key={index}
                                        onClick={item.clickAction}
                                        className={cx('menu-option', {
                                            separate: item.separate,
                                        })}
                                    >
                                        <span className={cx('menu-icon')}>{item.icon}</span>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </DropDownMenu>
                        </div>
                        <div className={cx('header-action_cart', 'header-action_item')}>
                            <div className={cx('header-action_text')} onClick={handleCartClick}>
                                <span className={cx('box-icon')}>
                                    <CartIcon />
                                    <span className={cx('count-holder')}>
                                        <span className={cx('count')}>{countItems}</span>
                                    </span>
                                </span>
                                <span className={cx('box-text', 'text-center')}>
                                    <span className={cx('text-blow')}>Giỏ hàng</span>
                                </span>
                            </div>
                            <DropDownMenu anchorEl={cartAnchorEl} open={cartOpen} handleClose={handleClose} width={480}>
                                <div className={cx('header-dropdown_content')}>
                                    <p className={cx('box-title')}>Giỏ hàng</p>
                                    <div className={cx('cart-view')}>
                                        <div className={cx('cart-view-scroll')}>
                                            <div className={cx('cart-view_item')}>
                                                <table>
                                                    {cartItems?.items?.length > 0 ? (
                                                        <tbody>
                                                            {cartItems?.items?.map((cartItem, index) => (
                                                                <tr className={cx('mini-cart__item')} key={index}>
                                                                    <td className={cx('mini-cart__left')}>
                                                                        <Link
                                                                            to={`/products/${cartItem?.product?.slug}`}
                                                                        >
                                                                            <img
                                                                                src={`${cartItem?.product?.image}`}
                                                                                alt={`${cartItem?.product?.name}`}
                                                                            />
                                                                        </Link>
                                                                    </td>
                                                                    <td className={cx('mini-cart__right')}>
                                                                        <p className={cx('mini-cart__title')}>
                                                                            <Link
                                                                                className={cx('mnc-link')}
                                                                                to={`/products/${cartItem?.product?.slug}`}
                                                                            >
                                                                                {cartItem?.product?.name}
                                                                            </Link>
                                                                            {!(
                                                                                cartItem?.variant?.name === 'default'
                                                                            ) && (
                                                                                <span className={cx('mnc-variant')}>
                                                                                    {cartItem?.variant?.name}
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div className={cx('mini-cart__quantity')}>
                                                                                <div
                                                                                    className={cx(
                                                                                        'quantity',
                                                                                        'd-flex',
                                                                                        'align-items-center',
                                                                                    )}
                                                                                >
                                                                                    <div
                                                                                        className={cx('count-btn')}
                                                                                        onClick={() =>
                                                                                            handleDecreaseQuantity(
                                                                                                cartItem?.quantity,
                                                                                                cartItem?._id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={faMinus}
                                                                                        />
                                                                                    </div>
                                                                                    <p className={cx('number')}>
                                                                                        {cartQuantities[
                                                                                            cartItem?._id
                                                                                        ] || cartItem?.quantity}
                                                                                    </p>

                                                                                    <div
                                                                                        className={cx('count-btn')}
                                                                                        onClick={() =>
                                                                                            handleIncreaseQuantity(
                                                                                                cartItem?.product
                                                                                                    ?.stock,
                                                                                                cartItem?.quantity,
                                                                                                cartItem?._id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <FontAwesomeIcon
                                                                                            icon={faPlus}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className={cx('mini-cart__price')}>
                                                                                {new Intl.NumberFormat('en-US').format(
                                                                                    cartItem?.product?.priceFinal *
                                                                                        1000,
                                                                                )}
                                                                                ₫
                                                                                {cartItem?.product?.priceFinal !==
                                                                                    cartItem?.product
                                                                                        ?.priceOriginal && (
                                                                                    <del
                                                                                        className={cx('original-price')}
                                                                                    >
                                                                                        {new Intl.NumberFormat(
                                                                                            'en-US',
                                                                                        ).format(
                                                                                            cartItem?.product
                                                                                                ?.priceOriginal * 1000,
                                                                                        )}
                                                                                        ₫
                                                                                    </del>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className={cx('mini-cart__remove')}>
                                                                            <Button
                                                                                onlyIcon
                                                                                leftIcon={
                                                                                    <FontAwesomeIcon
                                                                                        icon={faTrashCan}
                                                                                    />
                                                                                }
                                                                                onClick={() =>
                                                                                    handleRemoveItem(cartItem)
                                                                                }
                                                                            ></Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    ) : (
                                                        <tbody>
                                                            <tr className={cx('mini-cart__empty')}>
                                                                <td>
                                                                    <div className={cx('shopping-cart-icon')}>
                                                                        <ShoppingCartIcon />
                                                                    </div>
                                                                    Hiện chưa có sản phẩm
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    )}
                                                </table>
                                            </div>
                                        </div>
                                        <div className={cx('cart-view-line')}></div>
                                    </div>
                                    <div className={cx('cart-view-total')}>
                                        <table className={cx('table-total')}>
                                            <tbody>
                                                <tr>
                                                    <td className={cx('total-title')}>TỔNG TIỀN:</td>
                                                    <td className={cx('total-text')}>
                                                        {cartItems?.items?.length > 0
                                                            ? new Intl.NumberFormat('en-US').format(
                                                                  cartItems?.totalPriceFinal * 1000,
                                                              )
                                                            : 0}
                                                        ₫
                                                    </td>
                                                </tr>
                                                <tr className={cx('mini-cart__button')}>
                                                    <td colSpan="2">
                                                        <Button
                                                            to="/cart"
                                                            primary
                                                            small
                                                            className={cx('view-cart-btn')}
                                                        >
                                                            Xem giỏ hàng
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </DropDownMenu>
                        </div>
                    </div>
                </div>
                <div className={cx('header-menu')}>
                    <div className={cx('header-list')}>
                        {HEADER_TAB.map((item, index) => {
                            return (
                                <Button
                                    key={index}
                                    className={cx('header-item', { active: slug.slug === item.slug })}
                                    leftIcon={item.icon}
                                    whiteOutline
                                    to={`/category/${item.slug}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    {item.title}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
