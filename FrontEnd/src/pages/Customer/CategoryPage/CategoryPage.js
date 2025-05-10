import classnames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faCheck, faX, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useParams } from 'react-router-dom'
// import { faFilter } from '@fortawesome/free-regular-svg-icons'
import { useEffect, useState, useCallback } from 'react'

import styles from './CategoryPage.module.scss'
import Button from '~/components/Button'
import ProductList from '~/components/ProductList'
import { Spinner } from 'react-bootstrap'

const cx = classnames.bind(styles)

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
]

const ROOM_MAP = {
    'living-room': 'Phòng khách',
    bedroom: 'Phòng ngủ',
    office: 'Nội thất văn phòng',
    bathroom: 'Phòng tắm',
    kitchen: 'Phòng bếp',
}
const CATEGORY_MAP = {
    sofa: 'Sofa',
    desk: 'Bàn',
    chair: 'Ghế',
    beds: 'Giường',
    'store-organization': 'Tủ kệ',
    decor: 'Trang trí',
}

const priceOptions = [
    { label: 'Dưới 1.000.000₫', value: '<1000000' },
    { label: '1.000.000₫ - 2.000.000₫', value: '1000000-2000000' },
    { label: '2.000.000₫ - 3.000.000₫', value: '2000000-3000000' },
    { label: '3.000.000₫ - 4.000.000₫', value: '3000000-4000000' },
    { label: 'Trên 4.000.000₫', value: '>4000000' },
]

function CategoryPage() {
    const [selectedValue, setSelectedValue] = useState('price_asc')
    const [productCount, setProductCount] = useState(0) // Để lưu số lượng sản phẩm
    const [brands, setBrands] = useState([])
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedPrices, setSelectedPrices] = useState([])
    const [pageTitle, setPageTitle] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const [isOpenSort, setIsOpenSort] = useState(true)
    const [isOpenBrand, setIsOpenBrand] = useState(true)
    const [isOpenPrice, setIsOpenPrice] = useState(true)

    const [openFilterMenu, setOpenFilterMenu] = useState(false)

    // eslint-disable-next-line
    const [loading, setLoading] = useState(false)
    const slug = useParams()

    // Callback function để nhận số lượng sản phẩm từ ProductList
    const handleProductCount = useCallback((count) => {
        setProductCount(count)
    }, [])

    const handleBrandChange = useCallback((brands) => {
        setBrands(brands)
    }, [])

    // Xử lý khi chọn brand
    const handleBrandSelect = (brand) => {
        setSelectedBrands((prevSelected) =>
            prevSelected.includes(brand) ? prevSelected.filter((item) => item !== brand) : [...prevSelected, brand],
        )
        setCurrentPage(1)
    }

    // Xử lý khi chọn khoảng giá
    const handlePriceSelect = (priceRange) => {
        setSelectedPrices((prevSelected) =>
            prevSelected.includes(priceRange)
                ? prevSelected.filter((item) => item !== priceRange)
                : [...prevSelected, priceRange],
        )
        setCurrentPage(1)
    }

    useEffect(() => {
        document.body.classList.toggle('no-scroll', openFilterMenu)
    }, [openFilterMenu])

    useEffect(() => {
        setCurrentPage(1)
        // setLoading(true);
        setSelectedValue('price_asc')
        setSelectedBrands([])
        setSelectedPrices([])

        const slugValue = slug.slug

        if (ROOM_MAP[slugValue]) {
            setPageTitle(ROOM_MAP[slugValue])
        } else if (CATEGORY_MAP[slugValue]) {
            setPageTitle(CATEGORY_MAP[slugValue])
        }
    }, [slug])

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
            )
        })
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {loading ? (
                    <div className={cx('loading-container')}>
                        <Spinner animation="border" className={cx('loading-spinner')} />
                    </div>
                ) : (
                    <>
                        <div
                            className={cx('filter', 'col-12', 'col-md-12', 'col-lg-3', 'd-lg-block', {
                                'd-none': !openFilterMenu,
                            })}
                        >
                            <div
                                className={cx('filter-wrapper', {
                                    'd-block': openFilterMenu,
                                })}
                            >
                                <div
                                    className={cx('filter-container', {
                                        'show-filter': openFilterMenu,
                                    })}
                                >
                                    <div className={cx('filter-title', 'd-block', 'd-lg-none')}>
                                        <p className={cx('filter-heading')}>
                                            <FontAwesomeIcon icon={faFilter} className={cx('heading-icon')} />
                                            Bộ lọc
                                        </p>
                                        <div className={cx('close-filter')}>
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                className={cx('close-icon')}
                                                onClick={() => {
                                                    setOpenFilterMenu(false)
                                                    setSelectedValue('price_asc')
                                                    setSelectedBrands([])
                                                    setSelectedPrices([])
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={cx('filter-group-container')}>
                                        {/*filter sortby*/}
                                        <div className={cx('filter-group', 'd-block', 'd-lg-none')}>
                                            <div className={cx('filter-group-block')}>
                                                <div
                                                    className={cx('filter-group-title')}
                                                    onClick={() => setIsOpenSort(!isOpenSort)}
                                                >
                                                    <span className={cx('text')}>Sắp xếp</span>
                                                </div>
                                                <div
                                                    className={cx('filter-group-content', {
                                                        'sidebox-content-toggled': !isOpenSort,
                                                    })}
                                                >
                                                    <ul className={cx('checkbox-list')}>
                                                        {SORT_MENU.map((item, index) => {
                                                            return (
                                                                <li className={cx('checkbox-item')} key={index}>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`data-sort-${index}`}
                                                                        value={item.value}
                                                                        className={cx('input-field')}
                                                                        checked={selectedValue === item.value}
                                                                        onChange={() => setSelectedValue(item.value)}
                                                                    />
                                                                    <label
                                                                        className={cx('checkbox-label')}
                                                                        htmlFor={`data-sort-${index}`}
                                                                    >
                                                                        {item.title}
                                                                    </label>
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {/* filter brand */}
                                        <div className={cx('filter-group')}>
                                            <div className={cx('filter-group-block')}>
                                                <div
                                                    className={cx('filter-group-title')}
                                                    onClick={() => setIsOpenBrand(!isOpenBrand)}
                                                >
                                                    <span className={cx('text')}>Nhà cung cấp</span>
                                                </div>
                                                <div
                                                    className={cx('filter-group-content', {
                                                        'sidebox-content-toggled': !isOpenBrand,
                                                    })}
                                                >
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
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {/* filter price */}
                                        <div className={cx('filter-group')}>
                                            <div className={cx('filter-group-block')}>
                                                <div
                                                    className={cx('filter-group-title')}
                                                    onClick={() => setIsOpenPrice(!isOpenPrice)}
                                                >
                                                    <span className={cx('text')}>Giá</span>
                                                </div>
                                                <div
                                                    className={cx('filter-group-content', {
                                                        'sidebox-content-toggled': !isOpenPrice,
                                                    })}
                                                >
                                                    <ul className={cx('checkbox-list')}>
                                                        {priceOptions.map((price, index) => (
                                                            <li className={cx('checkbox-item')} key={index}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={`price-${index}`}
                                                                    value={price.value}
                                                                    className={cx('input-field')}
                                                                    checked={selectedPrices.includes(price.value)}
                                                                    onChange={() => handlePriceSelect(price.value)}
                                                                />
                                                                <label
                                                                    className={cx('checkbox-label')}
                                                                    htmlFor={`price-${index}`}
                                                                >
                                                                    {price.label}
                                                                </label>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* filter color */}
                                    {/* filter size */}

                                    <div className={cx('filter-footer', 'd-lg-none')}>
                                        <Button
                                            outline
                                            className={cx('col-5', 'action-btn')}
                                            onClick={() => {
                                                setOpenFilterMenu(false)
                                                setSelectedValue('price_asc')
                                                setSelectedBrands([])
                                                setSelectedPrices([])
                                            }}
                                        >
                                            Huỷ
                                        </Button>
                                        <Button
                                            primary
                                            className={cx('col-5', 'action-btn')}
                                            onClick={() => setOpenFilterMenu(false)}
                                        >
                                            Áp dụng
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('content', 'col-12', 'col-md-12', 'col-lg-9')}>
                            <div className={cx('heading')}>
                                <div className={cx('heading-content', 'd-block', 'd-lg-flex')}>
                                    <div className={cx('heading-box')}>
                                        <h1 className={cx('heading-title')}>{pageTitle}</h1>
                                        <div className={cx('filter-box')}>
                                            <span className={cx('title-count')}>
                                                <b>{productCount}</b> sản phẩm
                                            </span>
                                            <p
                                                className={cx('title-filter', 'd-sm-flex', 'd-lg-none')}
                                                onClick={() => setOpenFilterMenu(!openFilterMenu)}
                                            >
                                                <span>Bộ lọc</span>
                                                <FontAwesomeIcon icon={faFilter} className={cx('filter-icon')} />
                                            </p>
                                        </div>
                                    </div>

                                    <div className={cx('heading-sortby', 'd-none', 'd-lg-block')}>
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
                                                )
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
                                                const label = priceOptions.find((p) => p.value === value)?.label
                                                return (
                                                    <span key={index}>
                                                        {index >= 1 ? ', ' : ''} {label}
                                                    </span>
                                                )
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
                                            setSelectedPrices([])
                                            setSelectedBrands([])
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
                                    setCurrentPage={setCurrentPage}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CategoryPage
