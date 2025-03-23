import classnames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import styles from './ProductList.module.scss';

import httpRequest from '~/utils/httpRequest';
import ProductCard from '~/components/ProductCard';
import CustomPagination from '~/components/CustomPagination';
// import { Spinner } from 'react-bootstrap';

const cx = classnames.bind(styles);

function ProductList({
    onProductCountChange,
    onBrandChange,
    sortBy,
    selectedBrands,
    selectedPrices,
    currentPage,
    paginate,
}) {
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const category = useParams();
    const firstLoad = useRef(true);
    const previousCategory = useRef(null);

    // const [currentProduct, setCurrentProduct] = useState(null);
    const itemsPerPage = 12;

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                let queryParams = new URLSearchParams();

                // Thêm nhiều brand vào query
                selectedBrands.forEach((brand) => queryParams.append('brand', brand));

                selectedPrices.forEach((range) => queryParams.append('priceRanges', range));

                if (sortBy) queryParams.append('sortBy', sortBy);
                const res = await httpRequest.get(`/products/category/${category.slug}?${queryParams.toString()}`);
                setProducts(res);

                if (previousCategory.current !== category.slug) {
                    firstLoad.current = true;
                    previousCategory.current = category.slug;
                }

                onProductCountChange(res.length);

                if (firstLoad.current) {
                    const brands = Array.from(new Set(res.map((product) => product.brand))); // Lấy các brand duy nhất
                    onBrandChange(brands);
                    firstLoad.current = false;
                }
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                // setTimeout(() => {
                setLoading(false);
                // }, 200);
            }
        };

        fetchData();
        // eslint-disable-next-line
    }, [category, sortBy, selectedBrands, selectedPrices]);

    if (loading) {
        return <></>;
        // <Spinner animation="border" className={cx('loading-spinner')} />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    return (
        <div className={cx('wrapper', 'row')}>
            {currentProducts.length === 0 ? (
                <div>Không tìm thấy kết quả. Vui lòng thử lại!</div>
            ) : (
                currentProducts.map((product, index) => {
                    return (
                        <div key={index} className={cx('product-item', 'col-md-3', 'col-6')}>
                            <ProductCard product={product} />
                        </div>
                    );
                })
            )}
            <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
        </div>
    );
}

export default ProductList;
