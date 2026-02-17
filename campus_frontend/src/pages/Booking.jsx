import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Clock, AlertCircle, Calendar as CalendarIcon, User, IdCard, Info } from 'lucide-react';

export default function Bookings() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const resourceId = searchParams.get('resourceId');
    const today = new Date().toISOString().split('T')[0];

    const [users, setUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [userNameInput, setUserNameInput] = useState('');

    // Time state
    const [startTime, setStartTime] = useState({ h: '09', m: '00', p: 'AM' });
    const [endTime, setEndTime] = useState({ h: '11', m: '00', p: 'AM' });

    const [formData, setFormData] = useState({
        user: '',
        resource: resourceId || '',
        booking_date: today,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        Promise.all([api.get('/users/'), api.get('/resources/')])
            .then(([userData, resourceData]) => {
                setUsers(userData);
                setResources(resourceData);
            });
    }, []);

    const formatTo24h = (time) => {
        let hours = parseInt(time.h);
        if (time.p === 'PM' && hours < 12) hours += 12;
        if (time.p === 'AM' && hours === 12) hours = 0;
        return `${hours.toString().padStart(2, '0')}:${time.m}:00`;
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setUserNameInput(name);
        const foundUser = users.find(u => (u.name === name || u.campus_id === name) && (selectedRole === '' || u.role === selectedRole));
        setFormData({ ...formData, user: foundUser ? foundUser.id : '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.user) {
            setError("Please search and select a valid member (ID or Name).");
            return;
        }

        const start24 = formatTo24h(startTime);
        const end24 = formatTo24h(endTime);

        // Basic frontend check for current time if date is today
        if (formData.booking_date === today) {
            const now = new Date();
            const currentCheck = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;
            if (start24 < currentCheck) {
                setError("Cannot book a slot in the past. Please select a future time.");
                return;
            }
        }

        try {
            await api.post('/bookings', {
                ...formData,
                start_time: start24,
                end_time: end24
            });
            setSuccess(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            let msg = err.message;
            try {
                const parsed = JSON.parse(err.message);
                if (parsed.non_field_errors) msg = parsed.non_field_errors[0];
                else if (typeof parsed === 'object') msg = Object.values(parsed)[0][0];
            } catch (e) { }
            setError(msg);
        }
    };

    if (success) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '4rem', display: 'inline-block', borderRadius: '32px' }}>
                    <Clock size={64} color="#facc15" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Request Sent!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Your booking is currently **Pending Admin Approval**.</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Redirecting you to dashboard...</p>
                </div>
            </div>
        );
    }

    const TimeSelector = ({ label, value, onChange }) => (
        <div style={{ flex: 1 }}>
            <label>{label}</label>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
                <select value={value.h} onChange={e => onChange({ ...value, h: e.target.value })} style={{ flex: 1, padding: '0.5rem' }}>
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <select value={value.m} onChange={e => onChange({ ...value, m: e.target.value })} style={{ flex: 1, padding: '0.5rem' }}>
                    {['00', '15', '30', '45'].map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <select value={value.p} onChange={e => onChange({ ...value, p: e.target.value })} style={{ flex: 1, padding: '0.5rem', background: 'var(--primary)', color: 'white' }}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '650px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1rem' }}>Reserve a Resource</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={16} /> Note: You can book a maximum of 5 hours per day.
                </p>

                <form onSubmit={handleSubmit} className="glass" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {error && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', color: '#f87171', fontSize: '0.9rem' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Role</label>
                            <select value={selectedRole} onChange={e => { setSelectedRole(e.target.value); setUserNameInput(''); setFormData({ ...formData, user: '' }); }}>
                                <option value="">-- All Roles --</option>
                                <option value="STUDENT">Student</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label>Search member (ID/Name)</label>
                            <input
                                type="text"
                                list="user-list"
                                required
                                placeholder="Type ID or name..."
                                value={userNameInput}
                                onChange={handleNameChange}
                            />
                            <datalist id="user-list">
                                {users.filter(u => selectedRole === '' || u.role === selectedRole).map(u => (
                                    <option key={u.id} value={u.campus_id}>{u.name} ({u.role})</option>
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div>
                        <label>Resource</label>
                        <select required value={formData.resource} onChange={e => setFormData({ ...formData, resource: e.target.value })}>
                            <option value="">-- Select Facility --</option>
                            {resources.map(r => <option key={r.id} value={r.id}>{r.name} - {r.type}</option>)}
                        </select>
                    </div>

                    <div>
                        <label>Date</label>
                        <input
                            type="date"
                            required
                            min={today}
                            value={formData.booking_date}
                            onChange={e => setFormData({ ...formData, booking_date: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <TimeSelector label="Start Time" value={startTime} onChange={setStartTime} />
                        <TimeSelector label="End Time" value={endTime} onChange={setEndTime} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}>
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
