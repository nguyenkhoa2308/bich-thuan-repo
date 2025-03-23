import classnames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Carousel.module.scss';

const cx = classnames.bind(styles);

function Carousel({ slides }) {
    const [slide, setSlide] = useState(0);
    const autoplayRef = useRef(null);

    const nextSlide = () => {
        setSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    // Hàm chuyển đến slide trước đó
    const prevSlide = () => {
        setSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    // Autoslide logic
    // Reset autoplay mỗi khi có thao tác
    const resetAutoplay = () => {
        clearTimeout(autoplayRef.current);
        autoplayRef.current = setTimeout(() => {
            nextSlide();
        }, 5000); // Đặt lại thời gian 5s
    };

    // Autoplay khi component mount
    useEffect(() => {
        resetAutoplay();
        return () => clearTimeout(autoplayRef.current); // Cleanup timeout khi unmount
    }); // Mỗi lần slide thay đổi, khởi động lại autoplay

    return (
        <div className={cx('carousel')}>
            <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className={cx('arrow', 'left')}
                onClick={() => {
                    prevSlide();
                    resetAutoplay();
                }}
            />
            {slides.map((item, index) => {
                return (
                    <img
                        src={item.src}
                        alt={item.alt}
                        key={index}
                        className={cx('slide', { hidden: slide !== index })}
                    />
                );
            })}
            <FontAwesomeIcon icon={faCircleArrowRight} className={cx('arrow', 'right')} onClick={nextSlide} />
            <span className={cx('indicators')}>
                {slides.map((_, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                nextSlide();
                                resetAutoplay();
                            }}
                            className={cx('indicator', { active: slide === index })}
                        ></button>
                    );
                })}
            </span>
        </div>
    );
}

export default Carousel;
