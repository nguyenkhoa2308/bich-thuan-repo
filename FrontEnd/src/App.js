import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

//User
import DefaultLayout from '~/layouts/DefaultLayout';
import Home from '~/pages/Customer/Home';
import Login from '~/pages/Customer/Login';
import SignUp from '~/pages/Customer/SignUp';
import ResetPassword from '~/pages/Customer/ResetPassword';
import CategoryPage from '~/pages/Customer/CategoryPage';
import ProductDetail from '~/pages/Customer/ProductDetail';
import AccountLayout from '~/layouts/AccountLayout';
import Profile from '~/pages/Customer/Profile';
import PurchasePage from '~/pages/Customer/PurchasePage';
import Addresses from '~/pages/Customer/Addresses';
import ChangePassword from '~/pages/Customer/ChangePassword';
import Cart from '~/pages/Customer/Cart';
import CheckOut from '~/pages/Customer/CheckOut';
import SearchPage from '~/pages/Customer/SearchPage/SearchPage';

//Admin
import ProtectedRoute from '~/routes/ProtectedRoute';
import AdminDashboard from '~/pages/Admin/AdminDashboard';
import AdminLayout from '~/layouts/AdminLayout';
import UserManagement from '~/pages/Admin/UserManagement';
import ProductManagement from '~/pages/Admin/ProductManagement';
import OrderManagement from '~/pages/Admin/OrderManagement';
import CategoryManagement from '~/pages/Admin/CategoryManagement';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="" element={<DefaultLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="category/:slug" element={<CategoryPage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<SignUp />} />
                    <Route path="reset/:token" element={<ResetPassword />} />
                    <Route path="products/:slug" element={<ProductDetail />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<CheckOut />} />
                    <Route path="search" element={<SearchPage />} />
                </Route>
                <Route path="account" element={<AccountLayout />}>
                    <Route path="" element={<Profile />}></Route>
                    <Route path="addresses" element={<Addresses />}></Route>
                    <Route path="password" element={<ChangePassword />}></Route>
                    <Route path="purchase" element={<PurchasePage />}></Route>
                </Route>
                {/* Layout dành riêng cho admin */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    {/* <Route index element={<ProductManagement />} /> */}
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="users" element={<UserManagement />}>
                        <Route path=":id" element={<UserManagement />} />
                    </Route>
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
