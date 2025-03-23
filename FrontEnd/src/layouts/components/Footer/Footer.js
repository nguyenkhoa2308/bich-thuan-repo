import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

import styles from './Footer.module.scss';
import Button from '~/components/Button';
import { faFacebookF, faYoutube } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

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
                    <div className={cx('newsletter-block')}>
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
            <div className={cx('footer-copyright')}>
                <p>
                    Copyright © 2025 <Link to="/"> NinFurniture</Link>
                    {'. '}
                    <Link to="/">Powered by Ninne</Link>
                </p>
            </div>
        </div>
    );
}

export default Footer;
