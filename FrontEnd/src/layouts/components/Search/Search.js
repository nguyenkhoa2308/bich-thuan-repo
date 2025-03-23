import classNames from 'classnames/bind';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmarkCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';
import * as searchService from '~/services/searchService';
import ProductItem from '~/components/ProductItem';

const cx = classNames.bind(styles);

function Search() {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [visibleCount, setVisibleCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const inputRef = useRef();
    const debouncedValue = useDebounce(searchValue, 500);

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            return;
        }

        const fetchAPI = async () => {
            setLoading(true);
            const result = await searchService.search(debouncedValue);
            const visibleProducts = result.length > 4 ? result.slice(0, 4) : result;
            setVisibleCount(result.length - 4);
            setSearchResult(visibleProducts);
            setLoading(false);
        };

        fetchAPI();
    }, [debouncedValue]);

    const handleClear = () => {
        setSearchValue('');
        setSearchResult([]);
        inputRef.current.focus();
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleSelectProduct = () => {
        setSearchValue('');
        setSearchResult([]);
        setShowResult(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (!value.startsWith(' ')) {
            setSearchValue(value);
        }
    };

    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/search?q=${searchValue}`);
            setSearchValue('');
            setShowResult(false);
            inputRef.current.blur();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={cx('wrapper')}>
            <HeadlessTippy
                interactive
                visible={showResult && searchResult.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                        <div className={cx('search-result__item')}>
                            {searchResult.map((result) => (
                                <div key={result._id} onClick={handleSelectProduct}>
                                    <ProductItem data={result} />
                                </div>
                            ))}
                            {visibleCount > 0 && (
                                <div className={cx('view-more')} onClick={handleSearch}>
                                    Xem thêm {visibleCount} sản phẩm
                                </div>
                            )}
                        </div>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search')}>
                    <input
                        className={cx('search-input')}
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Tìm kiếm sản phẩm..."
                        spellCheck={false}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                        onFocus={() => setShowResult(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faXmarkCircle} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('search-btn')} onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
