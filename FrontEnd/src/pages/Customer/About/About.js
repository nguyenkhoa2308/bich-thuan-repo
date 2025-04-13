import classNames from 'classnames/bind'

import styles from './About.module.scss'

const cx = classNames.bind(styles)

function About() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')}>
                <div className={cx('col-12', 'col-lg-9', 'col-md-8')}></div>
                <div className={cx('col-12', 'col-lg-3', 'col-md-4')}></div>
            </div>
        </div>
    )
}

export default About
