import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, Package, Calendar, MessageSquare } from 'lucide-react';

export default function MyBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const [allBookings, allResources] = await Promise.all([
                    api.get('/bookings/'),
                    api.get('/resources/')
                ]);

                const myBookings = allBookings.filter(b => b.user === user.id);
                const resMap = {};
                allResources.forEach(r => resMap[r.id] = r);

                setBookings(myBookings);
                setResources(resMap);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading your bookings...</div>;

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${m} ${ampm}`;
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Bookings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Track the status of your facility reservations.</p>
            </header>

            <div className="grid">
                {bookings.map(b => (
                    <div key={b.id} className="glass card" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
                                    <Package size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{resources[b.resource]?.name || 'Facility'}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{resources[b.resource]?.type}</p>
                                </div>
                            </div>
                            <span className={`badge ${b.status === 'APPROVED' ? 'badge-active' : b.status === 'REJECTED' ? 'badge-inactive' : 'badge-pending'}`}>
                                {b.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <Calendar size={16} color="var(--text-muted)" />
                                <span>{b.booking_date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                                <Clock size={16} color="var(--text-muted)" />
                                <span>{formatTime(b.start_time)} - {formatTime(b.end_time)}</span>
                            </div>
                        </div>

                        {b.status === 'APPROVED' && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.85rem' }}>
                                <CheckCircle size={16} /> Your request has been approved!
                            </div>
                        )}

                        {b.status === 'REJECTED' && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#f87171' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <XCircle size={16} /> Rejection Notice
                                </div>
                                {b.rejection_reason && (
                                    <p style={{ fontSize: '0.8rem', paddingLeft: '1.5rem', opacity: 0.9 }}>
                                        <strong>Reason:</strong> {b.rejection_reason}
                                    </p>
                                )}
                            </div>
                        )}

                        {b.status === 'PENDING' && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <Clock size={16} /> Waiting for Admin approval.
                            </div>
                        )}
                    </div>
                ))}

                {bookings.length === 0 && (
                    <div className="glass" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', borderRadius: '24px' }}>
                        <Calendar size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No bookings found</h3>
                        <p style={{ color: 'var(--text-muted)' }}>You haven't made any reservations yet.</p>
                        <Link to="/bookings" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>Make a Booking</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
