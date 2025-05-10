/* eslint-disable jsx-a11y/heading-has-content */
import classNames from 'classnames/bind'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'

import styles from './Footer.module.scss'
import Button from '~/components/Button'

const cx = classNames.bind(styles)

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('footer-newsletter')}>
                <div className={cx('wrapbox-newsletter')}>
                    <div className={cx('newsletter-block')}>
                        <div className={cx('newsletter-title')}>
                            <h3>Đăng ký nhận tin</h3>
                        </div>
                        <div className={cx('newsletter-content')}>
                            <form className={cx('newsletter-form')}>
                                <div className={cx('input-group')}>
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className={cx('input-field')}
                                        required
                                    />
                                    <FontAwesomeIcon icon={faEnvelope} className={cx('input-icon')} />
                                </div>
                                <Button primary className={cx('input-group-btn')}>
                                    Đăng ký
                                </Button>
                            </form>
                        </div>
                    </div>
                    <div className={cx('newsletter-block', 'newsletter-social', 'd-none', 'd-md-flex')}>
                        <div className={cx('newsletter-title')}>
                            <h3>Kết nối với chúng tôi</h3>
                        </div>
                        <div className={cx('newsletter-content')}>
                            <div className={cx('social')}>
                                <Link to="/" className={cx('social-link')}>
                                    <FontAwesomeIcon icon={faFacebookF} className={cx('social-icon')} />
                                </Link>

                                <Link to="/" className={cx('social-link')}>
                                    <FontAwesomeIcon icon={faYoutube} className={cx('social-icon')} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('footer-container')}>
                <div className={cx('container-fluid')}>
                    <div className={cx('row')}>
                        <div className={cx('col-lg-3', 'col-md-12', 'col-12', 'd-none', 'd-lg-block')}>
                            <h4 className={cx('footer-title')}></h4>
                            <div className={cx('footer-content')}>
                                <div className={cx('address-footer')}>
                                    <ul className={cx('contact-list')}>
                                        <li className={cx('item')}>
                                            <FontAwesomeIcon icon={faLocationDot} className={cx('icon')} />
                                            <span className={cx('text')}>
                                                Bích Thuận Furniture: Hà Hương, xã Liên Hà, huyện Đông Anh, thành phố Hà
                                                Nội. Thời gian hoạt động: 9h00 - 21h00 (kể cả CN và ngày lễ)
                                            </span>
                                        </li>
                                        <li className={cx('item')}>
                                            <FontAwesomeIcon icon={faPhone} className={cx('icon')} />
                                            <span className={cx('text')}>(+84) 96 489 6098</span>
                                        </li>
                                        <li className={cx('item')}>
                                            <FontAwesomeIcon icon={faEnvelope} className={cx('icon')} />
                                            <span className={cx('text')}>bichthuanfurniture@gmail.com</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={cx('col-lg-3', 'col-md-12', 'col-12')}>
                            <h4 className={cx('footer-title')}>Về Bích Thuận</h4>
                            <div className={cx('footer-content')}>
                                <ul className={cx('footer-navLink')}>
                                    <li className={cx('item')}>
                                        <Link to="/pages/about" className={cx('link')}>
                                            Giới thiệu
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/contact" className={cx('link')}>
                                            Liên hệ
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/blog" className={cx('link')}>
                                            Blog
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={cx('col-lg-3', 'col-md-12', 'col-12')}>
                            <h4 className={cx('footer-title')}>Hỗ trợ khách hàng</h4>
                            <div className={cx('footer-content')}>
                                <ul className={cx('footer-navLink')}>
                                    <li className={cx('item')}>
                                        <Link to="/pages/faq" className={cx('link')}>
                                            Câu hỏi thường gặp
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/order-guide" className={cx('link')}>
                                            Hướng dẫn đặt hàng
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/momo-payment-guide" className={cx('link')}>
                                            Hướng dẫn thanh toán MOMO
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={cx('col-lg-3', 'col-md-12', 'col-12')}>
                            <h4 className={cx('footer-title')}>Chính sách</h4>
                            <div className={cx('footer-content')}>
                                <ul className={cx('footer-navLink')}>
                                    <li className={cx('item')}>
                                        <Link to="/pages/warranty-policy" className={cx('link')}>
                                            Chính sách bảo hành
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/shipping-cost" className={cx('link')}>
                                            Chi phí vận chuyển
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/return-and-refund-policy" className={cx('link')}>
                                            Chính sách đổi trả và hoàn tiền
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/shipping-policy" className={cx('link')}>
                                            Chính sách vận chuyển và giao nhận
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/payment-methods" className={cx('link')}>
                                            Các hình thức thanh toán
                                        </Link>
                                    </li>
                                    <li className={cx('item')}>
                                        <Link to="/pages/privacy-policy" className={cx('link')}>
                                            Chính sách bảo mật thông tin
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('footer-copyright')}>
                <p>
                    Copyright © 2025 <Link to="/"> BichThuanFurniture</Link>
                    {'. '}
                    <Link to="/">Powered by KhoaNee</Link>
                </p>
            </div>
        </div>
    )
}

export default Footer
