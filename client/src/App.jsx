import React, { useEffect, useState } from 'react';
import { listBooks, createBook, updateBook, deleteBook } from './api';
import BookForm from './components/BookForm.jsx';
import BookList from './components/BookList.jsx';

export default function App() {
    const [books, setBooks] = useState([]);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState(null);
    const [loadingList, setLoadingList] = useState(true);

    async function refresh() {
        setError(null);
        setLoadingList(true);
        try {
            const data = await listBooks();
            setBooks(Array.isArray(data) ? data : (data.items || [])); // supports future pagination
        } catch (e) {
            setError(e.message);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => { refresh(); }, []);

    async function handleSubmit(data) {
        setError(null);
        try {
            if (editing) {
                await updateBook(editing._id, data);
                setEditing(null);
            } else {
                await createBook(data);
            }
            await refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleDelete(id) {
        setError(null);
        try {
            await deleteBook(id);
            await refresh();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div style={{ padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
            <h1>📚 Bookstore</h1>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <button onClick={refresh}>Refresh</button>
                {loadingList && <span>Loading…</span>}
            </div>

            {error && (
                <div style={{ background: '#ffe6e6', color: '#900', padding: 8, marginBottom: 12, border: '1px solid #f99' }}>
                    {error}
                </div>
            )}

            <BookForm onSubmit={handleSubmit} editing={editing} onCancel={() => setEditing(null)} />
            <BookList books={books} onEdit={setEditing} onDelete={handleDelete} />
        </div>
    );
}