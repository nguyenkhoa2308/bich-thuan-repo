import classNames from 'classnames/bind'

import styles from './Contact.module.scss'

const cx = classNames.bind(styles)

function Contact() {
    return (
        <div className={cx('wrapper')}>
            <section>
                <h1>Liên hệ với chúng tôi</h1>

                <p>
                    Chúng tôi rất mong nhận được phản hồi từ bạn! Nếu bạn có bất kỳ câu hỏi nào về sản phẩm, dịch vụ,
                    hoặc muốn đặt mua, đừng ngần ngại liên hệ với chúng tôi qua các kênh dưới đây.
                </p>

                <h2>Thông tin liên hệ</h2>
                <ul>
                    <li>
                        <strong>Địa chỉ:</strong> 123 Đường Nội Thất, Quận 9, TP.HCM
                    </li>
                    <li>
                        <strong>Hotline:</strong> 1900 123 456
                    </li>
                    <li>
                        <strong>Email:</strong> <a href="mailto:support@bichthuan.vn">support@bichthuan.vn</a>
                    </li>
                </ul>

                <h2>Form liên hệ</h2>
                <p>Điền thông tin vào form dưới đây để chúng tôi có thể phản hồi bạn nhanh nhất:</p>

                <form action="submit_form.php" method="POST">
                    <label for="name">Họ và tên:</label>
                    <input type="text" id="name" name="name" required />
                    <br />

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                    <br />

                    <label for="phone">Số điện thoại:</label>
                    <input type="tel" id="phone" name="phone" />
                    <br />

                    <label for="message">Lời nhắn:</label>
                    <textarea id="message" name="message" rows="5" required></textarea>
                    <br />

                    <button type="submit">Gửi thông tin</button>
                </form>
            </section>
        </div>
    )
}

export default Contact
