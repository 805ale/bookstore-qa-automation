import React, { useEffect, useState } from 'react';

// include new fields in the empty shape
const empty = { title: '', author: '', price: '', isbn: '', stock: '', category: 'Other', publishedYear: '' };

// keep categories in one place so UI and backend enum match
const CATEGORIES = ['Fantasy', 'Sci-Fi', 'Romance', 'Non-Fiction', 'Other'];

export default function BookForm({ onSubmit, editing, onCancel }) {
    const [form, setForm] = useState(empty);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // prefill on edit; fall back to defaults if any field is missing
        editing
            ? setForm({
                title: editing.title ?? '',
                author: editing.author ?? '',
                price: editing.price ?? '',
                isbn: editing.isbn ?? '',
                stock: editing.stock ?? '',
                category: editing.category ?? 'Other',
                publishedYear: editing.publishedYear ?? ''
            })
            : setForm(empty);
    }, [editing]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit({
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
                // send number if provided, else omit so backend default/validation applies
                ...(form.publishedYear !== '' ? { publishedYear: Number(form.publishedYear) } : {})
            });
            if (!editing) setForm(empty);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} aria-label="book-form" style={{ display: 'grid', gap: 8, marginBottom: 16, maxWidth: 760 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
                <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />

                <input name="price" placeholder="Price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
                <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required disabled={!!editing} />

                <input name="stock" placeholder="Stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} />

                {/* New: Category select */}
                <select name="category" value={form.category} onChange={handleChange} aria-label="Category">
                    {CATEGORIES.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                {/* New: Published Year (optional) */}
                <input
                    name="publishedYear"
                    placeholder="Published Year (optional)"
                    type="number"
                    min="0"
                    step="1"
                    value={form.publishedYear}
                    onChange={handleChange}
                />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" disabled={submitting}>
                    {submitting ? 'Saving…' : editing ? 'Update Book' : 'Add Book'}
                </button>
                {editing && (
                    <button type="button" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}