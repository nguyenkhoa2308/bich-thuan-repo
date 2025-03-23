import { useEffect, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Autoplay } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/thumbs';
import './style.scss';

function ProductImagesSlider({ images, variantIndex }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [mainSwiper, setMainSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(variantIndex || 0);

    // Đợi thumbsSwiper sẵn sàng trước khi gọi slideTo
    useEffect(() => {
        if (thumbsSwiper && mainSwiper && variantIndex !== null) {
            setTimeout(() => {
                thumbsSwiper.slideTo(variantIndex);
                mainSwiper.slideTo(variantIndex);
            }, 100); // Tránh lỗi chưa có slide
        }
    }, [variantIndex, thumbsSwiper, mainSwiper]);

    // Callback để lưu Swiper instance
    const handleMainSwiper = useCallback((swiper) => setMainSwiper(swiper), []);
    const handleThumbsSwiper = useCallback((swiper) => setThumbsSwiper(swiper), []);

    return (
        <div className="wrapper-swiper">
            <Swiper
                onSwiper={handleMainSwiper}
                loop={false}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="gallery-slider"
            >
                {images.map((item, index) => (
                    <SwiperSlide key={index}>
                        <img src={item} alt={`thumb ${index}`} loading="lazy" />
                    </SwiperSlide>
                ))}
            </Swiper>

            <Swiper
                onSwiper={handleThumbsSwiper}
                loop={false}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="gallery-thumb"
            >
                {images.map((item, index) => (
                    <SwiperSlide key={index} className={index === activeIndex ? 'active-thumb' : ''}>
                        <img src={item} alt={`thumb ${index}`} loading="lazy" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ProductImagesSlider;
