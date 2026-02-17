import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Mail, AlertCircle, ShieldCheck, GraduationCap, Briefcase, IdCard } from 'lucide-react';

export default function Login() {
    const [role, setRole] = useState('STUDENT'); // Default to Student
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(role, identifier, password);
        setLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    const roles = [
        { id: 'STUDENT', label: 'Student', icon: <GraduationCap size={18} /> },
        { id: 'STAFF', label: 'Staff', icon: <Briefcase size={18} /> },
        { id: 'ADMIN', label: 'Admin', icon: <ShieldCheck size={18} /> },
    ];

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
            <div className="glass card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Select your role to access the portal</p>
                </div>

                {/* Role Selector Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '14px' }}>
                    {roles.map(r => (
                        <button
                            key={r.id}
                            onClick={() => { setRole(r.id); setError(''); setIdentifier(''); setPassword(''); }}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                background: role === r.id ? 'var(--primary)' : 'transparent',
                                color: role === r.id ? 'white' : 'var(--text-muted)',
                            }}
                        >
                            {r.icon} {r.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {error && (
                        <div className="glass" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', color: '#f87171', fontSize: '0.85rem' }}>
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <div>
                        <label>{role === 'ADMIN' ? 'Username' : `${role} ID or Email`}</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                {role === 'ADMIN' ? <User size={18} /> : <IdCard size={18} />}
                            </div>
                            <input
                                type="text"
                                required
                                style={{ paddingLeft: '3rem' }}
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                placeholder={role === 'ADMIN' ? 'Admin username' : `Enter your ${role} ID`}
                            />
                        </div>
                    </div>

                    <div>
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                style={{ paddingLeft: '3rem' }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
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
                        {loading ? 'Authenticating...' : `Login as ${role}`}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                        {role === 'ADMIN'
                            ? 'Authorized personnel only.'
                            : `Use your assigned ${role} ID and password provided by the Admin.`
                        }
                    </p>
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
