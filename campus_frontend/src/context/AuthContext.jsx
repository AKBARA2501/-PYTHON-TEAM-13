import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('campus_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (role, identifier, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, identifier, password })
            });

            const data = await response.json();

            if (data.success) {
                const authUser = {
                    id: data.user.id,
                    username: data.user.campus_id || data.user.email,
                    role: data.user.role,
                    name: data.user.name
                };
                setUser(authUser);
                localStorage.setItem('campus_user', JSON.stringify(authUser));
                return { success: true };
            }

            return { success: false, message: data.message || 'Invalid credentials.' };
        } catch (err) {
            console.error(err);
            return { success: false, message: 'Server connection error.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('campus_user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAdmin: user?.role === 'ADMIN',
            isMember: user?.role === 'STUDENT' || user?.role === 'STAFF',
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
