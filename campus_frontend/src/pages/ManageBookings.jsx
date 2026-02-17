import { useState, useEffect } from 'react';
import { api } from '../api';
import { Check, X, Trash2, Clock, MapPin, User, Info, Filter, MessageSquare } from 'lucide-react';

export default function ManageBookings() {
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState({});
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterPending, setFilterPending] = useState(false);

    const fetchData = async () => {
        try {
            const [bData, uData, rData] = await Promise.all([
                api.get('/bookings/'),
                api.get('/users/'),
                api.get('/resources/')
            ]);

            const userMap = {}; uData.forEach(u => userMap[u.id] = u);
            const resMap = {}; rData.forEach(r => resMap[r.id] = r);

            setBookings(bData);
            setUsers(userMap);
            setResources(resMap);
            setLoading(false);
        } catch (err) {
            alert("Fetch error: " + err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const approveBooking = async (id) => {
        try {
            await api.patch(`/bookings/${id}`, { status: 'APPROVED' });
            fetchData();
        } catch (err) {
            alert("Error approving: " + err.message);
        }
    };

    const rejectBooking = async (id) => {
        const reason = window.prompt("Please enter the reason for rejection:");
        if (reason === null) return; // Cancelled

        try {
            await api.patch(`/bookings/${id}`, { status: 'REJECTED', rejection_reason: reason });
            fetchData();
        } catch (err) {
            alert("Error rejecting: " + err.message);
        }
    };

    const deleteBooking = async (id) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (err) {
                alert("Error deleting: " + err.message);
            }
        }
    };

    const displayedBookings = filterPending
        ? bookings.filter(b => b.status === 'PENDING')
        : bookings.sort((a, b) => (a.status === 'PENDING' ? -1 : 1));

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Moderator Console...</div>;

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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Moderation Panel</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Review and manage all resource reservation requests.</p>
                </div>
                <button
                    onClick={() => setFilterPending(!filterPending)}
                    className={filterPending ? "btn-primary" : "btn-secondary"}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: filterPending ? 'var(--primary)' : 'rgba(255,255,255,0.05)' }}
                >
                    <Filter size={18} /> {filterPending ? "Show All" : "Action Required Only"}
                </button>
            </header>

            <div className="glass" style={{ overflow: 'hidden', borderRadius: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1.25rem' }}>User & Resource</th>
                            <th style={{ padding: '1.25rem' }}>Schedule</th>
                            <th style={{ padding: '1.25rem' }}>Status</th>
                            <th style={{ padding: '1.25rem' }}>Availability Check</th>
                            <th style={{ padding: '1.25rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedBookings.map(b => {
                            const u = users[b.user];
                            const r = resources[b.resource];
                            const conflicts = bookings.filter(other =>
                                other.id !== b.id &&
                                other.resource === b.resource &&
                                other.booking_date === b.booking_date &&
                                other.status === 'APPROVED' &&
                                (other.start_time < b.end_time && other.end_time > b.start_time)
                            ).length;

                            return (
                                <tr key={b.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontWeight: 600 }}>{u?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r?.name} ({r?.type})</div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontSize: '0.9rem' }}>{b.booking_date}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {formatTime(b.start_time)} - {formatTime(b.end_time)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span className={`badge ${b.status === 'APPROVED' ? 'badge-active' : b.status === 'REJECTED' ? 'badge-inactive' : 'badge-pending'}`}>
                                            {b.status}
                                        </span>
                                        {b.status === 'REJECTED' && b.rejection_reason && (
                                            <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '0.25rem', maxWidth: '150px' }}>
                                                Reason: {b.rejection_reason}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        {conflicts > 0 ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.85rem' }}>
                                                <Info size={16} /> Conflict ({conflicts})
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.85rem' }}>
                                                <Check size={16} /> Available
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {b.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => approveBooking(b.id)} className="btn-primary" style={{ padding: '0.5rem', borderRadius: '8px' }} title="Approve">
                                                        <Check size={18} />
                                                    </button>
                                                    <button onClick={() => rejectBooking(b.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }} title="Reject">
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => deleteBooking(b.id)} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
