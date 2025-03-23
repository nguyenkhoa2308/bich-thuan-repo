import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    secondary = false,
    text = false,
    onlyIcon = false,
    outline = false,
    whiteOutline = false,
    outlineDarkColor = false,
    disabled = false,
    rounded = false,
    small = false,
    large = false,
    xLarge = false,
    children,
    className,
    leftIcon,
    rightIcon,
    onClick,
    onKeyDown,
    ...passProps
}) {
    let Comp = 'button';
    const _props = {
        onClick,
        onKeyDown,
        ...passProps,
    };

    if (disabled) {
        Object.keys(_props).forEach((key) => {
            if (key.startsWith('on') && typeof _props[key] === 'function') {
                delete _props[key];
            }
        });
    }

    if (to) {
        _props.to = to;
        Comp = Link;
    } else if (href) {
        _props.href = href;
        Comp = 'a';
    }

    const classes = cx('wrapper', {
        [className]: className,
        primary,
        secondary,
        text,
        onlyIcon,
        outline,
        whiteOutline,
        outlineDarkColor,
        disabled,
        rounded,
        small,
        large,
        xLarge,
    });

    return (
        <Comp className={classes} {..._props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    xLarge: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onClick: PropTypes.func,
};

export default Button;
