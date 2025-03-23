import classnames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

import styles from './CategoryPage.module.scss';
import Button from '~/components/Button';
import ProductList from '~/components/ProductList';
import httpRequest from '~/utils/httpRequest';
import { ToastContainer } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

const cx = classnames.bind(styles);

const SORT_MENU = [
    {
        title: 'Giá: Tăng dần',
        value: 'price_asc',
    },
    {
        title: 'Giá: Giảm dần',
        value: 'price_desc',
    },
    {
        title: 'Tên: A - Z',
        value: 'name_asc',
    },
    {
        title: 'Tên: Z - A',
        value: 'name_desc',
    },
    {
        title: 'Cũ nhất',
        value: 'oldest',
    },
    {
        title: 'Mới nhất',
        value: 'newest',
    },
    {
        title: 'Bán chạy nhất',
        value: 'best_seller',
    },
];

const ROOM_MAP = {
    'living-room': 'Phòng khách',
    bedroom: 'Phòng ngủ',
    office: 'Nội thất văn phòng',
    bathroom: 'Phòng tắm',
    kitchen: 'Phòng bếp',
};

const priceOptions = [
    { label: 'Dưới 1.000.000₫', value: '<1000000' },
    { label: '1.000.000₫ - 2.000.000₫', value: '1000000-2000000' },
    { label: '2.000.000₫ - 3.000.000₫', value: '2000000-3000000' },
    { label: '3.000.000₫ - 4.000.000₫', value: '3000000-4000000' },
    { label: 'Trên 4.000.000₫', value: '>4000000' },
];

function CategoryPage() {
    const [selectedValue, setSelectedValue] = useState('price_asc');
    const [productCount, setProductCount] = useState(0); // Để lưu số lượng sản phẩm
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [pageTitle, setPageTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [loading, setLoading] = useState(false);

    // Chuyển trang
    const paginate = (pageNumber) => {
        // setLoading(true);
        setCurrentPage(pageNumber);

        // Cuộn trang về vị trí danh sách sản phẩm (hoặc vị trí mong muốn)
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // setTimeout(() => {
        //     setLoading(false);
        // }, 500);
    };

    const slug = useParams();

    // Callback function để nhận số lượng sản phẩm từ ProductList
    const handleProductCount = useCallback((count) => {
        setProductCount(count);
    }, []);

    const handleBrandChange = useCallback((brands) => {
        setBrands(brands);
    }, []);

    // Xử lý khi chọn brand
    const handleBrandSelect = (brand) => {
        setSelectedBrands((prevSelected) =>
            prevSelected.includes(brand) ? prevSelected.filter((item) => item !== brand) : [...prevSelected, brand],
        );
        setCurrentPage(1);
    };

    // Xử lý khi chọn khoảng giá
    const handlePriceSelect = (priceRange) => {
        setSelectedPrices((prevSelected) =>
            prevSelected.includes(priceRange)
                ? prevSelected.filter((item) => item !== priceRange)
                : [...prevSelected, priceRange],
        );
        setCurrentPage(1);
    };

    useEffect(() => {
        setCurrentPage(1);
        // setLoading(true);

        if (ROOM_MAP[slug.slug]) {
            // Nếu là room, setCategory thành tên tiếng Việt
            setPageTitle(ROOM_MAP[slug.slug]);
            // setTimeout(() => {
            //     setLoading(false);
            // }, 350);
        } else {
            // Nếu không, gọi API để lấy category
            const fetchData = async () => {
                try {
                    const res = await httpRequest.get(`categories/${slug.slug}`);
                    setPageTitle(res.displayName);
                    // setTimeout(() => {
                    //     setLoading(false);
                    // }, 300);
                } catch (err) {
                    console.log(err);
                }
            };
            fetchData();
        }
    }, [slug]);

    const renderMenu = () => {
        return SORT_MENU.map((item, index) => {
            return (
                <Button
                    key={index}
                    className={cx('sortby-option')}
                    leftIcon={
                        <span className={cx('menu-icon')}>
                            {selectedValue === item.value ? <FontAwesomeIcon icon={faCheck} /> : null}
                        </span>
                    }
                    onClick={() => setSelectedValue(item.value)}
                >
                    <span className={cx('menu-item--title')}>{item.title}</span>
                </Button>
            );
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {loading ? (
                    <div className={cx('loading-container')}>
                        <Spinner animation="border" className={cx('loading-spinner')} />
                    </div>
                ) : (
                    <>
                        <div className={cx('filter')}>
                            {/* filter brand */}
                            <div className={cx('filter-group')}>
                                <div className={cx('filter-group-block')}>
                                    <div className={cx('filter-group-title')}>
                                        <span className={cx('text')}>Nhà cung cấp</span>
                                    </div>
                                    <div className={cx('filter-group-content')}>
                                        <ul className={cx('checkbox-list')}>
                                            {brands.map((item, index) => {
                                                return (
                                                    <li className={cx('checkbox-item')} key={index}>
                                                        <input
                                                            type="checkbox"
                                                            id={`data-brand-${index}`}
                                                            value={item}
                                                            className={cx('input-field')}
                                                            checked={selectedBrands.includes(item)}
                                                            onChange={() => handleBrandSelect(item)}
                                                        />
                                                        <label
                                                            className={cx('checkbox-label')}
                                                            htmlFor={`data-brand-${index}`}
                                                        >
                                                            {item}
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* filter price */}
                            <div className={cx('filter-group')}>
                                <div className={cx('filter-group-block')}>
                                    <div className={cx('filter-group-title')}>
                                        <span className={cx('text')}>Giá</span>
                                    </div>
                                    <div className={cx('filter-group-content')}>
                                        <ul className={cx('checkbox-list')}>
                                            {priceOptions.map((price, index) => (
                                                <li className={cx('checkbox-item')} key={index}>
                                                    <input
                                                        type="checkbox"
                                                        id={`price-${index}`}
                                                        className={cx('input-field')}
                                                        checked={selectedPrices.includes(price.value)}
                                                        onChange={() => handlePriceSelect(price.value)}
                                                    />
                                                    <label className={cx('checkbox-label')} htmlFor={`price-${index}`}>
                                                        {price.label}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/* filter color */}
                            {/* filter size */}
                        </div>
                        <div className={cx('content')}>
                            <div className={cx('heading')}>
                                <div className={cx('heading-content')}>
                                    <div className={cx('heading-box')}>
                                        <h1 className={cx('heading-title')}>{pageTitle}</h1>
                                        <div className={cx('filter-box')}>
                                            <span className={cx('title-count')}>
                                                <b>{productCount}</b> sản phẩm
                                            </span>
                                        </div>
                                    </div>

                                    <div className={cx('heading-sortby')}>
                                        <div className={cx('sortby-container')}>
                                            <p className={cx('sortby-title')}>
                                                <span className={cx('sortby-icon')}>
                                                    <FontAwesomeIcon icon={faFilter} />
                                                </span>
                                                Sắp xếp
                                            </p>
                                        </div>
                                        <div className={cx('dropdown')}>
                                            <div className={cx('menu-list')}>
                                                <div className={cx('menu-body')}>{renderMenu()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('filter-tags')}>
                                    <div
                                        className={cx('brand-tags', {
                                            opened: selectedBrands.length > 0,
                                        })}
                                    >
                                        Nhà cung cấp:{' '}
                                        <b>
                                            {selectedBrands.map((value, index) => {
                                                return (
                                                    <span key={index}>
                                                        {index >= 1 ? ', ' : ''} {value}
                                                    </span>
                                                );
                                            })}
                                        </b>
                                        <span className={cx('remove-tag')} onClick={() => setSelectedBrands([])}>
                                            <FontAwesomeIcon icon={faX} />
                                        </span>
                                    </div>
                                    <div
                                        className={cx('price-tags', {
                                            opened: selectedPrices.length > 0,
                                        })}
                                    >
                                        Giá:{' '}
                                        <b>
                                            {selectedPrices.map((value, index) => {
                                                const label = priceOptions.find((p) => p.value === value)?.label;
                                                return (
                                                    <span key={index}>
                                                        {index >= 1 ? ', ' : ''} {label}
                                                    </span>
                                                );
                                            })}
                                        </b>
                                        <span className={cx('remove-tag')} onClick={() => setSelectedPrices([])}>
                                            <FontAwesomeIcon icon={faX} />
                                        </span>
                                    </div>
                                    <div
                                        className={cx('remove-all-tags', {
                                            opened: selectedBrands.length > 0 && selectedPrices.length > 0,
                                        })}
                                        onClick={() => {
                                            setSelectedPrices([]);
                                            setSelectedBrands([]);
                                        }}
                                    >
                                        <span>Xóa hết</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('list-product')}>
                                <ProductList
                                    onProductCountChange={handleProductCount}
                                    onBrandChange={handleBrandChange}
                                    sortBy={selectedValue}
                                    selectedBrands={selectedBrands}
                                    selectedPrices={selectedPrices}
                                    currentPage={currentPage}
                                    paginate={paginate}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default CategoryPage;
