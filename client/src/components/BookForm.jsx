import React, { useState, useEffect } from 'react';

const emptyForm = { title: '', author: '', price: '', isbn: '', stock: '' };

export default function BookForm({ onSubmit, editing }) {
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        editing ? setForm(editing) : setForm(emptyForm);
    }, [editing]);

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
        });
        setForm(emptyForm);
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
            <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
            <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
            <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleChange} />
            <button type="submit">{editing ? 'Update' : 'Add'} Book</button>
        </form>
    );
}