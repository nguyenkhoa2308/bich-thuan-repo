import classnames from 'classnames/bind';

import styles from './ProductDialog.module.scss';
// import ProductDetail from '~/pages/ProductDetail';
import ProductInfo from '../../ProductInfo';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const cx = classnames.bind(styles);

function ProductDialog({ data, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={cx('modal-wrapper')}>
            <div
                className={cx('modal-overlay', {
                    show: isOpen,
                })}
            >
                <div className={cx('modal-content')}>
                    {/* <h3 className={cx('title')}>Bạn chắc chắn muốn bỏ sản phẩm này ra khỏi giỏ hàng?</h3> */}
                    <div className={cx('product-wrapper')}>
                        <ProductInfo data={data} onClose={onClose} />
                        <div className={cx('footer')}>
                            <Link to={`/products/${data?.slug}`} className={cx('link')}>
                                Xem chi tiết sản phẩm {' >>>'}
                            </Link>
                        </div>
                        <div className={cx('close-btn')} onClick={onClose}>
                            <FontAwesomeIcon icon={faX} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDialog;
