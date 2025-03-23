import { Pagination } from 'react-bootstrap';
import classnames from 'classnames/bind';
import styles from './CustomPagination.module.scss';

const cx = classnames.bind(styles);

function CustomPagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null; // Không hiển thị nếu chỉ có 1 trang

    const maxPagesToShow = 5; // Số trang tối đa hiển thị
    let items = [];

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={cx('page-item', { active: i === currentPage })}
                >
                    {i}
                </Pagination.Item>,
            );
        }
    } else {
        items.push(
            <Pagination.Item
                key={1}
                onClick={() => onPageChange(1)}
                className={cx('page-item', { active: currentPage === 1 })}
            >
                1
            </Pagination.Item>,
        );

        if (currentPage > 3) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={cx('page-item', { active: currentPage === i })}
                >
                    {i}
                </Pagination.Item>,
            );
        }

        if (currentPage < totalPages - 2) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
        }

        items.push(
            <Pagination.Item
                key={totalPages}
                onClick={() => onPageChange(totalPages)}
                className={cx('page-item', { active: currentPage === totalPages })}
            >
                {totalPages}
            </Pagination.Item>,
        );
    }

    return (
        <Pagination className={cx('pagination-shop')}>
            {currentPage > 1 && (
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} className={cx('page-item')} />
            )}

            {items}

            {currentPage < totalPages && (
                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} className={cx('page-item')} />
            )}
        </Pagination>
    );
}

export default CustomPagination;
