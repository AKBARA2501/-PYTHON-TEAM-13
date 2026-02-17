import { useState, useEffect } from 'react';
import { api } from '../api';
import { UserPlus, UserCircle, Trash2, X, IdCard, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Community() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phone: '',
        campus_id: '',
        password: '',
        role: 'STUDENT'
    });
    const { isAdmin } = useAuth();

    const fetchUsers = () => {
        api.get('/users/').then(data => {
            setUsers(data);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', newUser);
            setShowAdd(false);
            setNewUser({ name: '', email: '', phone: '', campus_id: '', password: '', role: 'STUDENT' });
            fetchUsers();
        } catch (err) {
            alert("Error adding member: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this member? All their bookings will be removed.")) {
            await api.delete(`/users/${id}`);
            fetchUsers();
        }
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Campus Community</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Meet and manage the students and staff members of our campus.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowAdd(true)} className="btn-primary">
                        <UserPlus size={20} /> Add Member
                    </button>
                )}
            </header>

            {isAdmin && showAdd && (
                <div className="glass" style={{ marginBottom: '2.5rem', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
                    <button onClick={() => setShowAdd(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                    <h2 style={{ marginBottom: '1.5rem' }}>Create New Member Account</h2>
                    <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label>Full Name</label>
                            <input required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="John Doe" />
                        </div>
                        <div>
                            <label>Email Address</label>
                            <input type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="john@campus.edu" />
                        </div>
                        <div>
                            <label>Campus ID (Student/Staff ID)</label>
                            <input required value={newUser.campus_id} onChange={e => setNewUser({ ...newUser, campus_id: e.target.value })} placeholder="e.g. STU123 / STF456" />
                        </div>
                        <div>
                            <label>Initial Password</label>
                            <input type="password" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Set account password" />
                        </div>
                        <div>
                            <label>Phone Number</label>
                            <input required value={newUser.phone} onChange={e => setNewUser({ ...newUser, phone: e.target.value })} placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label>Role</label>
                            <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="STUDENT">Student</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>Save Member to Database</button>
                    </form>
                </div>
            )}

            <div className="grid">
                {users.map(u => (
                    <div key={u.id} className="glass card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                            <UserCircle size={40} color="var(--primary)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h3 style={{ marginBottom: '0.1rem' }}>{u.name}</h3>
                                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>#{u.campus_id}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{u.email}</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span className="badge glass-pill" style={{ fontSize: '0.7rem' }}>{u.role}</span>
                                <span className={`badge ${u.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '0.7rem' }}>
                                    {u.status}
                                </span>
                            </div>
                        </div>
                        {isAdmin && (
                            <button onClick={() => handleDelete(u.id)} style={{ background: 'none', color: 'rgba(239, 68, 68, 0.4)', padding: '0.5rem' }}>
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
