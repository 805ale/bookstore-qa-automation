export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:2000';

async function handle(res) {
    // Normalize responses: throw on non-2xx with parsed error
    if (!res.ok) {
        let err = {};
        try { err = await res.json(); } catch { }
        const message = err.error || `HTTP ${res.status}`;
        throw new Error(message);
    }
    // DELETE returns { ok: true }; others return JSON document(s)
    return res.status === 204 ? null : res.json();
}

export function listBooks() {
    return fetch(`${API_BASE}/api/books`).then(handle);
}

export function createBook(data) {
    return fetch(`${API_BASE}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handle);
}

export function updateBook(id, data) {
    return fetch(`${API_BASE}/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(handle);
}

export function deleteBook(id) {
    return fetch(`${API_BASE}/api/books/${id}`, { method: 'DELETE' }).then(handle);
}

