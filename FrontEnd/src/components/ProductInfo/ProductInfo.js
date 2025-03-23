import classnames from 'classnames/bind';
import { useEffect, useState, useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import styles from './ProductInfo.module.scss';
import ProductImagesSlider from '~/components/ProductImagesSlider';
import Button from '~/components/Button';
import { CartContext } from '~/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const cx = classnames.bind(styles);

function ProductInfo({ data, onClose = () => {} }) {
    const navigate = useNavigate();

    const [productImages, setProductImages] = useState([]);

    const [showVariant, setShowVariant] = useState();
    const [variantSelect, setVariantSelect] = useState(0);
    const [variantImage, setVariantImage] = useState();
    const [count, setCount] = useState(1);

    const { addToCart } = useContext(CartContext);

    const handleIncreaseQuantity = () => {
        if (count < data?.stock) {
            setCount((prev) => prev + 1);
        }
    };

    const handleDecreaseQuantity = () => {
        if (count > 1) {
            setCount((prev) => prev - 1);
        }
    };

    const handleInputChange = (e) => {
        let value = Number(e.target.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > data?.stock) {
            value = data?.stock;
        }
        setCount(value);
    };

    const handleAddToCart = async (productId, quantity, variantId) => {
        await addToCart(productId, quantity, variantId);
        onClose();
    };

    const handleBuyNow = async (productId, quantity, variantId) => {
        await addToCart(productId, quantity, variantId);
        navigate('/cart');
    };

    useEffect(() => {
        const images = data.variant.flatMap((variant) => variant.images);
        setProductImages(images);
        if (data.variant.length === 1 && data.variant[0].name === 'default') {
            setShowVariant(false);
        } else {
            setShowVariant(true);
        }
    }, [data]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('gallery', 'col-sm-5')}>
                <div className={cx('sticky-gallery')}>
                    <div className={cx('wrapbox-gallery', 'position-relative')}>
                        <div className={cx('rounded-1')}>
                            <ProductImagesSlider images={productImages} variantIndex={variantImage} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('content', 'col-sm-7')}>
                <div className={cx('wrapbox-detail')}>
                    <div className={cx('heading')}>
                        <h2 className={cx('heading-title')}>{data?.name}</h2>
                        <span className={cx('status')}>
                            {'Tình trạng: '}{' '}
                            <strong className={cx('strong-text')}>{data?.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</strong>
                        </span>
                        <span className={cx('brand')}>
                            {'Thương hiệu: '}
                            <strong className={cx('strong-text')}>{data?.brand}</strong>
                        </span>
                    </div>
                    <div className={cx('price')}>
                        <span className={cx('label')}>Giá: </span>
                        <span className={cx('price-final')}>
                            {new Intl.NumberFormat('en-US').format(data?.priceFinal * 1000)}₫
                        </span>
                        {data?.priceFinal !== data?.priceOriginal && (
                            <>
                                <del className={cx('price-original')}>
                                    {new Intl.NumberFormat('en-US').format(data?.priceOriginal * 1000)}₫
                                </del>
                                <span className={cx('sale-percent')}>
                                    -
                                    {(((data?.priceOriginal - data?.priceFinal) / data?.priceOriginal) * 100).toFixed()}
                                    %
                                </span>
                            </>
                        )}
                    </div>

                    {showVariant && (
                        <div className={cx('variants', 'd-flex', 'align-items-center')}>
                            <div className={cx('label')}>
                                Phiên bản:
                                <strong className={cx('variant-name')}>{data?.variant[variantSelect].name}</strong>
                            </div>
                            <div className={cx('variant-select')}>
                                {data?.variant.map((item, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            small
                                            className={cx('variant-option', {
                                                active: variantSelect === index,
                                            })}
                                            onClick={() => {
                                                setVariantSelect(index);
                                                setVariantImage(productImages.indexOf(item.images[0]));
                                            }}
                                        >
                                            {item.name}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className={cx('action')}>
                        <div className={cx('quantity', 'd-flex', 'align-items-center')}>
                            <div className={cx('label')}>Số lượng:</div>
                            <div className={cx('counter')}>
                                <div className={cx('count-btn')} onClick={handleDecreaseQuantity}>
                                    <FontAwesomeIcon icon={faMinus} />
                                </div>
                                {/* <p className={cx('number')}>{count}</p> */}
                                <input value={count} className={cx('number')} onChange={handleInputChange} />

                                <div className={cx('count-btn')} onClick={handleIncreaseQuantity}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </div>
                            </div>
                        </div>
                        <div className={cx('add-cart-area')}>
                            {data.stock === 0 ? (
                                <Button outline xLarge className={cx('out-of-stock-btn')}>
                                    Hết hàng
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        outline
                                        xLarge
                                        className={cx('add-cart-btn')}
                                        onClick={() =>
                                            handleAddToCart(data?._id, count, data?.variant[variantSelect]?._id)
                                        }
                                    >
                                        Thêm vào giỏ
                                    </Button>
                                    <Button
                                        primary
                                        xLarge
                                        className={cx('buy-btn')}
                                        onClick={() =>
                                            handleBuyNow(data?._id, count, data?.variant[variantSelect]?._id)
                                        }
                                    >
                                        Mua ngay
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductInfo;
