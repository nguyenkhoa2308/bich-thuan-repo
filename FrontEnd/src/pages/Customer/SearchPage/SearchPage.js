import classnames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import styles from './SearchPage.module.scss';
import { useDebounce } from '~/hooks';
import * as searchService from '~/services/searchService';
import ProductCard from '~/components/ProductCard';
import CustomPagination from '~/components/CustomPagination';

const cx = classnames.bind(styles);

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const debouncedValue = useDebounce(query, 500);

    useEffect(() => {
        if (debouncedValue === null) return;

        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchAPI = async () => {
            setLoading(true);
            const result = await searchService.search(debouncedValue);
            setSearchResult(result);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        };

        fetchAPI();
    }, [debouncedValue]);

    // Tính toán dữ liệu hiển thị theo trang
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = searchResult.slice(indexOfFirstProduct, indexOfLastProduct);

    // Chuyển trang
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);

        // Cuộn trang về vị trí danh sách sản phẩm (hoặc vị trí mong muốn)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(searchResult.length / itemsPerPage);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {loading ? (
                    <div className={cx('loading-container')}>
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <div className={cx('heading-page')}>
                            <h1 className={cx('title')}>Tìm kiếm</h1>
                            <p className={cx('sub-title')}>
                                Có <strong>{searchResult.length} sản phẩm</strong> cho tìm kiếm
                            </p>
                        </div>
                        <p className={cx('subtext-result')}>
                            Kết quả tìm kiếm cho <strong>"{query}"</strong>.
                        </p>
                        <div className={cx('product-wrapper', 'row')}>
                            {currentProducts.map((product, index) => {
                                return (
                                    <div key={index} className={cx('product-item', 'col-md-2', 'col-6')}>
                                        <ProductCard product={product} />
                                    </div>
                                );
                            })}
                        </div>
                        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchPage;
