import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { User, Mail, Phone, IdCard, Lock, UserPlus, AlertCircle, GraduationCap, Briefcase } from 'lucide-react';

export default function Signup() {
    const [role, setRole] = useState('STUDENT');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        campus_id: '',
        password: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRoleSelect = (r) => {
        setRole(r);
        setFormData({ ...formData, role: r });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/users', formData);
            setLoading(false);
            alert("Account created successfully! You can now log in.");
            navigate('/login');
        } catch (err) {
            setLoading(false);
            let msg = err.message;
            try {
                const parsed = JSON.parse(err.message);
                msg = Object.values(parsed)[0][0] || "Signup failed.";
            } catch (e) { }
            setError(msg);
        }
    };

    return (
        <div className="container" style={{ minHeight: '90vh', display: 'grid', placeItems: 'center', padding: '2rem 0' }}>
            <div className="glass card" style={{ width: '100%', maxWidth: '500px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary)', width: 64, height: 64, borderRadius: 16, display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem' }}>
                        <UserPlus size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem' }}>Join the Community</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Create your account to start booking</p>
                </div>

                {/* Role Selection */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        type="button"
                        onClick={() => handleRoleSelect('STUDENT')}
                        style={{
                            flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                            background: role === 'STUDENT' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <GraduationCap size={24} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Student</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRoleSelect('STAFF')}
                        style={{
                            flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                            background: role === 'STAFF' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Briefcase size={24} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Staff</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {error && (
                        <div className="glass" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', color: '#f87171', fontSize: '0.85rem' }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div>
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <User size={18} />
                            </div>
                            <input
                                required
                                style={{ paddingLeft: '3rem' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                style={{ paddingLeft: '3rem' }}
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@campus.edu"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>{role} ID</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <IdCard size={18} />
                                </div>
                                <input
                                    required
                                    style={{ paddingLeft: '3rem' }}
                                    value={formData.campus_id}
                                    onChange={e => setFormData({ ...formData, campus_id: e.target.value })}
                                    placeholder="ID 123"
                                />
                            </div>
                        </div>
                        <div>
                            <label>Phone</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Phone size={18} />
                                </div>
                                <input
                                    required
                                    style={{ paddingLeft: '3rem' }}
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91..."
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Secure Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                style={{ paddingLeft: '3rem' }}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ height: '52px', justifyContent: 'center', fontSize: '1rem', marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Creating Account...' : 'Create My Account'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
