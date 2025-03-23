import classnames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';

import styles from './UserManagement.module.scss';
import { AuthContext } from '~/contexts/AuthContext';
import EditRoleUserDialog from '~/components/Dialog/EditRoleUserDialog';
import httpRequest from '~/utils/httpRequest';
import CustomPagination from '~/components/CustomPagination';
import ConfirmDialog from '~/components/Dialog/ConfirmDialog';

const cx = classnames.bind(styles);

function UserManagement() {
    // eslint-disable-next-line
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [users, setUsers] = useState([]);
    // const [user, setUser] = useState();
    const [selectedUser, setSelectedUser] = useState(null);
    // const [selectedRole, setSelectedRole] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [updated, setUpdated] = useState(true);

    const [search, setSearch] = useState('');

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        if (!updated) return;
        const fetchUsers = async () => {
            try {
                const res = await httpRequest.get('/user'); // Gọi API lấy danh sách user
                setUsers(res);
                setFilteredUsers(res);
            } catch (error) {
                console.error('Lỗi lấy danh sách người dùng', error);
            }
        };
        fetchUsers();
        setUpdated(false);
    }, [updated]);

    // Xử lý tìm kiếm người dùng
    useEffect(() => {
        const sortedUsers = [...users].sort((a, b) =>
            a._id === auth?.user?.id ? -1 : b._id === auth?.user?.id ? 1 : 0,
        );
        setFilteredUsers(sortedUsers.filter((user) => user.displayName.toLowerCase().includes(search.toLowerCase())));
    }, [search, users, auth?.user?.id]);

    // Tính toán dữ liệu hiển thị theo trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Chuyển trang
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);

        // Cuộn trang về vị trí danh sách sản phẩm (hoặc vị trí mong muốn)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditClick = (user) => {
        // navigate(`/admin/users/${id}`);

        setIsEditDialogOpen(true);
        setSelectedUser(user);
    };

    const handleDelete = (user) => {
        setShowConfirmDialog(true);
        setSelectedUser(user);
    };

    const handleConfirm = async () => {
        setShowConfirmDialog(false);

        try {
            const res = await httpRequest.delete(`/user/${selectedUser._id}`); // Gọi API
            if (res.status === 200) {
                setUpdated(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="container mt-4">
            <h2>Quản lý người dùng</h2>
            {/* Thanh tìm kiếm */}
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Tìm kiếm người dùng theo tên..."
                    className="fs-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-primary" className={cx('search-btn')}>
                    <FontAwesomeIcon icon={faSearch} className="fs-5" />
                </Button>
            </InputGroup>

            {/* Bảng danh sách người dùng */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td>{user.birthDate}</td>
                                <td>{user.gender ? 'Nam' : 'Nữ'}</td>
                                <td>{user.role === 'admin' ? 'Admin' : 'Khách hàng'}</td>

                                <td>
                                    {!(user._id === auth?.user?.id) && !(user.role === 'admin') && (
                                        <>
                                            <Button
                                                variant="warning"
                                                className={cx('action-btn', 'me-2')}
                                                onClick={() => handleEditClick(user)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="fs-5" />
                                            </Button>

                                            <Button
                                                variant="danger"
                                                className={cx('action-btn')}
                                                onClick={() => handleDelete(user)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="fs-5" />
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                Không tìm thấy người dùng
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <EditRoleUserDialog
                data={selectedUser}
                setUpdated={setUpdated}
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
            />

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={() => handleConfirm()}
                title="Bạn có chắc chắn xóa người dùng này?"
            />

            <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
        </div>
    );
}

export default UserManagement;
