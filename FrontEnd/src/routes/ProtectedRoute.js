import { useContext } from 'react';
import { AuthContext } from '~/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const { auth, loading } = useContext(AuthContext); // 🔥 Thêm loading

    if (loading) return <div>Loading...</div>; // 🔥 Chờ auth load xong

    if (!auth.isAuthenticated) return <Navigate to="/login" replace />;

    if (role && auth.user.role !== role) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
