import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Form, Button, Modal, Spinner, Alert } from 'react-bootstrap';

import httpRequest from '~/utils/httpRequest';
import styles from './EditRoleUserDialog.module.scss';

// eslint-disable-next-line
const cx = classnames.bind(styles);

function EditRoleUserDialog({ data, setUpdated, isOpen, onClose }) {
    const [role, setRole] = useState('');
    const [updating, setUpdating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const [checkUpdate, setCheckUpdate] = useState(false);

    useEffect(() => {
        if (data) {
            setRole(data.role || ''); // Cập nhật role khi user thay đổi
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setSuccess(false);
        setError('');

        try {
            const response = await httpRequest.put(`/user/updateRole/${data._id}`, { role });

            if (response.EC === 0) {
                // Ẩn thông báo thành công sau 2 giây
                setTimeout(() => {
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 3000);
                }, 500);
                setCheckUpdate(true);
            }
        } catch (error) {
            // Ẩn thông báo lỗi sau 2 giây
            setTimeout(() => {
                setError(error.response?.data?.message || 'Có lỗi xảy ra');
                setTimeout(() => {
                    setError('');
                }, 3000);
            }, 500);
            setCheckUpdate(false);
        } finally {
            setTimeout(() => setUpdating(false), 500);
        }
    };

    if (!isOpen) return null;

    const handleClose = () => {
        if (checkUpdate) setUpdated((prev) => !prev);

        onClose();
    };

    return (
        <Modal show={isOpen} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className={cx('modal-title')}>Chỉnh sửa vai trò người dùng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success && <Alert variant="success">Cập nhật thành công!</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="role">
                        <Form.Label>Vai trò</Form.Label>
                        <Form.Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={cx('select-field')}
                        >
                            <option value="customer">Khách hàng</option>
                            <option value="admin">Admin</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" variant="primary" disabled={updating} className={cx('update-btn', 'mt-3')}>
                        {updating ? <Spinner animation="border" size="sm" /> : 'Cập nhật'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default EditRoleUserDialog;
