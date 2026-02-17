const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
    get: async (endpoint) => {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    post: async (endpoint, data) => {
        const res = await fetch(`${API_BASE}${endpoint}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(JSON.stringify(errData));
        }
        return res.json();
    },
    patch: async (endpoint, data) => {
        const res = await fetch(`${API_BASE}${endpoint}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    delete: async (endpoint) => {
        const res = await fetch(`${API_BASE}${endpoint}/`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error(await res.text());
        return true;
    }
};
