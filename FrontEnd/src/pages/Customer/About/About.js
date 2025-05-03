import classNames from 'classnames/bind'

import styles from './About.module.scss'

const cx = classNames.bind(styles)

function About() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h1 className={cx('text')}>Giới thiệu</h1>
            </div>
            <div className={cx('content')}>
                <h1 className={cx('content-heading')}>Bích Thuận – Không gian sống đẳng cấp cho mọi gia đình</h1>
                <p className={cx('text-center', 'description')}>
                    Chúng tôi tin rằng mỗi ngôi nhà đều xứng đáng với sự chỉn chu và tinh tế. Bích Thuận sẽ đồng hành
                    cùng bạn trong hành trình kiến tạo không gian sống hoàn hảo – từ những chi tiết nhỏ nhất.
                </p>
                <div className={cx('content-container')}>
                    <h2 className={cx('title')}>1. Về chúng tôi</h2>
                    <p>
                        Tại Bích Thuận, chúng tôi không chỉ là một cửa hàng nội thất – mà là nơi bạn tìm thấy giải pháp
                        toàn diện cho không gian sống của mình. Với hơn 10 năm kinh nghiệm trong ngành, thương hiệu Bích
                        Thuận đã và đang đồng hành cùng hàng ngàn gia đình Việt để kiến tạo những tổ ấm đẹp, tiện nghi
                        và đầy cảm hứng.
                    </p>

                    <h2 className={cx('title')}>2. Sản phẩm nổi bật của chúng tôi</h2>
                    <p className={cx('m-0')}>
                        Chúng tôi tự hào cung cấp một danh mục sản phẩm đa dạng, phù hợp với nhu cầu và phong cách của
                        từng gia đình. Các sản phẩm của chúng tôi bao gồm:
                    </p>
                    <ul className={cx('list')}>
                        <li className={cx('list-item')}>
                            <strong>Phòng khách</strong>: Sofa, bàn trà, kệ tivi hiện đại và cổ điển
                        </li>
                        <li className={cx('list-item')}>
                            <strong>Phòng ngủ</strong>: Giường ngủ, tủ quần áo, bàn trang điểm
                        </li>
                        <li className={cx('list-item')}>
                            <strong>Phòng ăn</strong>: Bàn ăn, ghế ăn, tủ bếp
                        </li>
                        <li className={cx('list-item')}>
                            <strong>Trang trí & phụ kiện</strong>: Đèn, thảm, tranh treo, gương decor
                        </li>
                    </ul>
                    <p>
                        Mỗi sản phẩm đều được chọn lọc kỹ lưỡng, đảm bảo về chất lượng, độ bền, và tính thẩm mỹ – nhằm
                        đáp ứng nhu cầu đa dạng của mọi khách hàng.
                    </p>

                    <h2 className={cx('title')}>3. Cam kết từ Bích Thuận</h2>
                    <p className={cx('m-0')}>
                        Chúng tôi luôn đặt <strong>trải nghiệm của khách hàng</strong> làm trọng tâm và cam kết:
                    </p>
                    <ul className={cx('list')}>
                        <li className={cx('list-item')}>
                            <strong>Chất lượng đảm bảo</strong> – Tất cả sản phẩm đều qua kiểm định trước khi đến tay
                            khách hàng
                        </li>
                        <li className={cx('list-item')}>
                            <strong>Giá cả hợp lý</strong> – Chính sách giá minh bạch, ưu đãi hấp dẫn quanh năm
                        </li>
                        <li className={cx('list-item')}>
                            <strong>Hỗ trợ tận tình</strong> – Đội ngũ tư vấn chuyên nghiệp, chăm sóc khách hàng 24/7
                        </li>
                        <li className={cx('list-item')}>
                            <strong>Giao hàng nhanh chóng</strong> – Vận chuyển toàn quốc, lắp đặt tận nơi
                        </li>
                    </ul>

                    <h2 className={cx('title')}>4. Tầm nhìn và sứ mệnh</h2>
                    <p>
                        <strong>Sứ mệnh</strong> của Bích Thuận là trở thành <strong>đối tác đáng tin cậy</strong> của
                        mọi gia đình Việt trong việc <strong>xây dựng không gian sống lý tưởng</strong>, không chỉ đẹp
                        mà còn mang tính cá nhân hoá cao.
                    </p>
                    <p>
                        <strong>Tầm nhìn</strong> của chúng tôi là trở thành{' '}
                        <strong>thương hiệu nội thất hàng đầu</strong> tại Việt Nam – với dịch vụ xuất sắc, sản phẩm
                        phong phú, và giá trị vượt mong đợi.
                    </p>

                    <h2 className={cx('title')}>5. Liên hệ với chúng tôi</h2>
                    <ul className={cx('list')}>
                        <li>
                            <strong>Địa chỉ</strong>: Hà Hương, xã Liên Hà, huyện Đông Anh, thành phố Hà Nội
                        </li>
                        <li>
                            <strong>Hotline</strong>: (+84) 96 489 6098
                        </li>
                        <li>
                            <strong>Email</strong>: bichthuanfurniture@gmail.com
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default About
