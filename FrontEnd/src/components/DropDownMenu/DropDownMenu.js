import classnames from 'classnames/bind';
import { Menu } from '@mui/material';

import styles from './DropDownMenu.module.scss';

// eslint-disable-next-line
const cx = classnames.bind(styles);

function DropDownMenu({ anchorEl, open, handleClose, width, children }) {
    // return <div className={cx('wrapper', { [className]: className })}>{children}</div>;
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
                overflow: 'visible',
                mt: 2,
                '& .MuiPaper-root': {
                    overflow: 'visible',

                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: '40px',
                        width: 10,
                        height: 10,
                        bgcolor: '#fff',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },

                '& .MuiList-root': {
                    width: `${width}px`,
                },
                '& .MuiMenuItem-root': {
                    fontSize: '1.3rem',
                    fontFamily: 'var(--font-family)',
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {children}
        </Menu>
    );
}

export default DropDownMenu;
