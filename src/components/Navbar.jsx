import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, LogIn, LogOut, Settings, UserCheck, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function Navbar() {
    const { user, isAdmin, isMember, logout } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin) {
            const fetchPending = async () => {
                try {
                    const bookings = await api.get('/bookings/');
                    const pending = bookings.filter(b => b.status === 'PENDING').length;
                    setPendingCount(pending);
                } catch (err) {
                    console.error("Failed to fetch notifications", err);
                }
            };
            fetchPending();
            const interval = setInterval(fetchPending, 10000); // Check every 10 seconds
            return () => clearInterval(interval);
        }
    }, [isAdmin]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: 'var(--primary)', width: 32, height: 32, borderRadius: 8, display: 'grid', placeItems: 'center' }}>C</div>
                CampusHub
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link to="/bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <Calendar size={16} /> Book
                </Link>

                {isAdmin && (
                    <Link to="/manage-bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', position: 'relative' }}>
                        <Settings size={16} /> Moderate
                        {pendingCount > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#ef4444', color: 'white', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 'bold', border: '2px solid rgba(0,0,0,0.3)' }}>
                                {pendingCount}
                            </span>
                        )}
                    </Link>
                )}

                {isMember && (
                    <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <UserCheck size={16} /> My Bookings
                    </Link>
                )}

                <Link to="/users" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                    <Users size={16} /> Community
                </Link>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
                        <button onClick={handleLogout} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <LogIn size={16} /> Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
