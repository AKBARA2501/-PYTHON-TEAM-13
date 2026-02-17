import { useState, useEffect } from 'react';
import { api } from '../api';
import { Package, Plus, Trash2, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newResource, setNewResource] = useState({ name: '', type: 'Lab', capacity: 10 });
    const { isAdmin } = useAuth();

    const fetchResources = () => {
        api.get('/resources/').then(data => {
            setResources(data);
            setLoading(false);
        }).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/resources', newResource);
            setShowAdd(false);
            setNewResource({ name: '', type: 'Lab', capacity: 10 });
            fetchResources();
        } catch (err) {
            alert("Error adding resource: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this resource? All associated bookings will be lost.")) {
            await api.delete(`/resources/${id}`);
            fetchResources();
        }
    };

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Campus Resources</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Explore and book facilities across the campus in real-time.</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowAdd(true)} className="btn-primary">
                        <Plus size={20} /> Add Resource
                    </button>
                )}
            </header>

            {isAdmin && showAdd && (
                <div className="glass" style={{ marginBottom: '2rem', padding: '2rem', borderRadius: '24px', position: 'relative' }}>
                    <button onClick={() => setShowAdd(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-muted)' }}>
                        <X size={24} />
                    </button>
                    <h2 style={{ marginBottom: '1.5rem' }}>Add New Resource</h2>
                    <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px auto', gap: '1rem', alignItems: 'flex-end' }}>
                        <div>
                            <label>Name</label>
                            <input required value={newResource.name} onChange={e => setNewResource({ ...newResource, name: e.target.value })} placeholder="e.g. Computer Lab A" />
                        </div>
                        <div>
                            <label>Type</label>
                            <select value={newResource.type} onChange={e => setNewResource({ ...newResource, type: e.target.value })}>
                                <option value="Lab">Lab</option>
                                <option value="Classroom">Classroom</option>
                                <option value="Event Hall">Event Hall</option>
                                <option value="Computer">Computer</option>
                            </select>
                        </div>
                        <div>
                            <label>Capacity</label>
                            <input type="number" required value={newResource.capacity} onChange={e => setNewResource({ ...newResource, capacity: e.target.value })} />
                        </div>
                        <button type="submit" className="btn-primary">Save Resource</button>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>Loading workspace...</div>
            ) : (
                <div className="grid">
                    {resources.map(item => (
                        <div key={item.id} className="glass card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
                                    <Package size={24} color="var(--primary)" />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span className={`badge ${item.status === 'AVAILABLE' ? 'badge-active' : 'badge-pending'}`}>
                                        {item.status}
                                    </span>
                                    {isAdmin && (
                                        <button onClick={() => handleDelete(item.id)} style={{ background: 'none', color: 'rgba(239, 68, 68, 0.6)' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Type: {item.type} • Capacity: {item.capacity}
                            </p>

                            <Link to={`/bookings?resourceId=${item.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                Book Now <ChevronRight size={18} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
