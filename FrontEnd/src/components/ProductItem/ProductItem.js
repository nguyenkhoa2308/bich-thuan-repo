import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './ProductItem.module.scss';
import Image from '~/components/Image';

const cx = classNames.bind(styles);

function ProductItem({ data }) {
    return (
        <Link to={`/products/${data.slug}`} className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('info')}>
                    <h4 className={cx('item-title')}>{data.name}</h4>
                    <div className={cx('product-price')}>
                        <span
                            className={cx('price-final', {
                                sale: data.priceFinal !== data.priceOriginal,
                            })}
                        >
                            {new Intl.NumberFormat('en-US').format(data.priceFinal * 1000)}₫
                        </span>
                        {data.priceFinal !== data.priceOriginal && (
                            <del className={cx('price-original')}>
                                {new Intl.NumberFormat('en-US').format(data.priceOriginal * 1000)}₫
                            </del>
                        )}
                    </div>
                </div>
                <div className={cx('avatar-container')}>
                    <Image className={cx('img-avatar')} src={data.image} alt={data.full_name} />
                </div>
            </div>
        </Link>
    );
}

export default ProductItem;
