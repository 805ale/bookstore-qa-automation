// API wrapper for backend calls
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:2000';

// GET all books
export async function listBooks() {
    const res = await fetch(`${API_BASE}/api/books`);
    return res.json();
}

// POST create book
export async function createBook(data) {
    const res = await fetch(`${API_BASE}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

// PUT update book
export async function updateBook(id, data) {
    const res = await fetch(`${API_BASE}/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

// DELETE book
export async function deleteBook(id) {
    const res = await fetch(`${API_BASE}/api/books/${id}`, { method: 'DELETE' });
    return res.json();
}