import classnames from 'classnames/bind'
import { Menu } from '@mui/material'

import styles from './DropDownMenu.module.scss'

// eslint-disable-next-line
const cx = classnames.bind(styles)

function DropDownMenu({ anchorEl, open, handleClose, width, children }) {
    return (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{
                overflow: 'visible',
                mt: 2,
                position: 'absolute',
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

                    // Media query cho mobile
                    '@media (max-width: 992px)': {
                        width: '100%',
                        maxWidth: '100%',
                        left: '0 !important',
                        top: '76px !important',

                        '&::before': {
                            right: '85px',
                        },
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
            MenuListProps={{
                autoFocusItem: false,
            }}
            aria-hidden={false}
            disableScrollLock
        >
            {children}
        </Menu>
    )
}

export default DropDownMenu
