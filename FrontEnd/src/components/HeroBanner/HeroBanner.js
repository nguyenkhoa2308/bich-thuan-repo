// import classnames from 'classnames/bind';

// import styles from './HeroBanner.module.scss';
import Carousel from '../Carousel';

// const cx = classnames.bind(styles);

const slides = [
    {
        src: 'https://res.cloudinary.com/dezywk7nm/image/upload/v1736552616/441509826_990610316184758_2838574682905952171_n_1_hwtkg3.png',
        atl: 'Banner 1',
    },
    {
        src: 'https://res.cloudinary.com/dezywk7nm/image/upload/v1736558036/furniture-sale-promotion-facebook-post-template-edit-online_ba8wz3.png',
        atl: 'Banner 2',
    },
    {
        src: 'https://res.cloudinary.com/dezywk7nm/image/upload/v1736552615/LIVING-ROOM-BOX-BANNER_jlnwze.png',
        atl: 'Banner 3',
    },
];

function HeroBanner() {
    return <Carousel slides={slides} />;
}

export default HeroBanner;
