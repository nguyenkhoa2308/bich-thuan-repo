import classnames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { getCategories, addCategory, updateCategory, deleteCategory } from '~/services/categoryService';

import styles from './CategoryManagement.module.scss';
import ConfirmDialog from '~/components/Dialog/ConfirmDialog';

const cx = classnames.bind(styles);

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryDisplayName, setCategoryDisplayName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const data = await getCategories();
        setCategories(data.categories);
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleSave = async () => {
        if (editingCategory) {
            await updateCategory(editingCategory._id, categoryName, categoryDisplayName);
        } else {
            await addCategory(categoryName, categoryDisplayName);
        }
        fetchCategories();
        setShowModal(false);
        setCategoryName('');
        setCategoryDisplayName('');
        setEditingCategory(null);
    };

    const handleEdit = (category) => {
        setCategoryName(category.name);
        setCategoryDisplayName(category.displayName);
        setEditingCategory(category);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setSelectedCategory(id);
        setShowConfirmModal(true);
    };

    const handleConfirm = async (id) => {
        setShowConfirmModal(false);
        await deleteCategory(id);
        fetchCategories();
    };

    return (
        <div>
            <h2>Quản lý danh mục</h2>
            <Form.Control
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
                }}
                className={cx('mb-4', 'search-field', 'mt-4')}
            />
            <Button onClick={() => setShowModal(true)} className={cx('action-btn')}>
                Thêm danh mục
            </Button>

            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Tên hiển thị</th>
                        <th>Slug</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map((category) => (
                        <tr key={category._id}>
                            <td>{category._id}</td>
                            <td>{category.name}</td>
                            <td>{category.displayName}</td>
                            <td>{category.slug}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    onClick={() => handleEdit(category)}
                                    className={cx('action-btn')}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(category._id)}
                                    className={cx('action-btn')}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Thêm / Sửa Danh Mục */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className={cx('modal-title')}>
                        {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label className={cx('label')}>Tên danh mục</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className={cx('input-field')}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={cx('label')}>Tên hiển thị</Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryDisplayName}
                                onChange={(e) => setCategoryDisplayName(e.target.value)}
                                className={cx('input-field')}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} className={cx('action-btn')}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSave} className={cx('action-btn')}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
            <ConfirmDialog
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={() => handleConfirm(selectedCategory)}
                title="Bạn có chắc chắn xóa danh mục này?"
            />
        </div>
    );
};

export default CategoryManagement;
