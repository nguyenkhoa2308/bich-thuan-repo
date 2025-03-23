import classnames from 'classnames/bind';

import styles from './ConfirmDialog.module.scss';

const cx = classnames.bind(styles);

function ConfirmDialog({ isOpen, onClose, onConfirm, title }) {
    if (!isOpen) return null;

    return (
        <div
            className={cx('modal-overlay', {
                show: isOpen,
            })}
        >
            <div className={cx('modal-content')}>
                <h3 className={cx('title')}>{title}</h3>
                {/* <h3 className={cx('title')}>Bạn chắc chắn muốn xóa sản phẩm này?</h3> */}
                <div className={cx('modal-action')}>
                    <button className={cx('cancel')} onClick={onClose}>
                        Hủy
                    </button>
                    <button className={cx('remove')} onClick={onConfirm}>
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
