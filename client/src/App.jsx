import React, { useEffect, useState } from 'react';
import { listBooks, createBook, updateBook, deleteBook } from './api';
import BookForm from './components/BookForm.jsx';
import BookList from './components/BookList.jsx';


export default function App() {
    const [books, setBooks] = useState([]);
    const [editing, setEditing] = useState(null);

    async function refresh() {
        const data = await listBooks();
        setBooks(data);
    }

    useEffect(() => {
        refresh();
    }, []);

    async function handleSubmit(data) {
        if (editing) {
            await updateBook(editing._id, data);
            setEditing(null);
        } else {
            await createBook(data);
        }
        await refresh();
    }

    async function handleDelete(id) {
        await deleteBook(id);
        await refresh();
    }

    return (
        <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
            <h1>📚 Bookstore</h1>
            <BookForm onSubmit={handleSubmit} editing={editing} />
            <BookList books={books} onEdit={setEditing} onDelete={handleDelete} />
        </div>
    );
}