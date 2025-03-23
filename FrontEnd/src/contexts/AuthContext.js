import { createContext, useState, useEffect } from 'react';

import httpRequest from '~/utils/httpRequest';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: '',
        email: '',
        name: '',
        role: '',
    },
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            id: '',
            email: '',
            name: '',
            role: '',
        },
    });
    const [loading, setLoading] = useState(true); // 🔥 Thêm biến loading

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setAuth({ isAuthenticated: false, user: null });
                setLoading(false); // ✅ Đánh dấu đã load xong
                return;
            }

            try {
                const res = await httpRequest.get(`user/account`);
                if (res && !res.message) {
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            id: res.id,
                            email: res.email,
                            name: res.name,
                            role: res.role,
                        },
                    });
                } else {
                    setAuth({ isAuthenticated: false, user: null });
                }
            } catch (error) {
                setAuth({ isAuthenticated: false, user: null });
            }
            setLoading(false); // ✅ Đánh dấu đã load xong
        };

        fetchAccount();
    }, []);

    return <AuthContext.Provider value={{ auth, loading, setAuth }}>{children}</AuthContext.Provider>;
};
