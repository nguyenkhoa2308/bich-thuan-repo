import { createContext, useState, useEffect, useContext } from 'react';
import httpRequest from '~/utils/httpRequest';
import { AuthContext } from '~/contexts/AuthContext';
import { Zoom, toast } from 'react-toastify';

export const CartContext = createContext({
    isAuthenticated: false,
    user: {
        email: '',
        name: '',
    },
});

export const CartProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState();
    const [countItems, setCountItems] = useState(0);

    const getCart = async () => {
        try {
            const res = await httpRequest.get('/cart/user');

            setCartItems(res?.cart);

            const items = res?.cart?.items;

            const countItem = items.reduce((prev, item) => {
                return prev + item.quantity;
            }, 0);

            setCountItems(countItem);
        } catch (error) {
            console.log('Không có cart');
        }
    };

    const addToCart = async (productId, quantity, variantId) => {
        try {
            const response = await httpRequest.post('cart/add', {
                productId,
                variantId,
                quantity,
            });

            // console.log(response);

            if (response.EC === 0) {
                toast.success('Thêm vào giỏ hàng thành công!', {
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
                getCart();
                console.log('Successful');
            } else {
                toast.error(`Thêm vào giỏ hàng thất bại! ${response.message}`, {
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
                console.log('Unsuccessful');
            }
        } catch (error) {
            // console.log(error);
            toast.error(
                <div>
                    Thêm vào giỏ hàng thất bại! <br />
                    {error.response.data.message}
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
            console.log('Unsuccessful');
        }
    };

    const deleteCartItem = async (cartItemId) => {
        try {
            const response = await httpRequest.delete(`cart/delete/${cartItemId}`);
            if (response.EC === 0) {
                getCart();
            } else {
                console.log('Error delete');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateQuantityOfCartItem = async (quantity, cartItemId) => {
        try {
            const response = await httpRequest.put(`cart/updateQuantity/`, {
                quantity: quantity,
                cartItemId: cartItemId,
            });
            if (response.EC === 0) {
                getCart();
            } else {
                console.log('Error update');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const addMultipleToCart = async (items) => {
        try {
            const response = await httpRequest.post('cart/add-multiple', {
                items,
            });
            getCart();

            if (response.status === 200) {
                toast.success('Thêm vào giỏ hàng thành công!', {
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
                console.log('Successful');
            } else {
                toast.error(
                    <div>
                        Thêm vào giỏ hàng thất bại! <br />
                        {response.message}
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
                console.warn('Có một số lỗi khi thêm vào giỏ hàng:');
            }
        } catch (error) {
            toast.error(
                <div>
                    Thêm vào giỏ hàng thất bại! <br />
                    {error.response.data.message}
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
            console.error('Lỗi khi thêm nhiều sản phẩm vào giỏ hàng:', error);
        }
    };

    useEffect(() => {
        if (auth?.user?.id) {
            getCart();
        } else {
            setCartItems([]); // Nếu chưa đăng nhập, giỏ hàng sẽ trống
            setCountItems(0);
        }
    }, [auth]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                countItems,
                setCartItems,
                setCountItems,
                getCart,
                addToCart,
                addMultipleToCart,
                deleteCartItem,
                updateQuantityOfCartItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
