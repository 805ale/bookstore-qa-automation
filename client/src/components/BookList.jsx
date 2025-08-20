import React from 'react';

export default function BookList({ books, onEdit, onDelete }) {
    if (!books.length) return <p>No books yet</p>;

    return (
        <table border="1" cellPadding="6">
            <thead>
                <tr>
                    <th>Title</th><th>Author</th><th>Price</th><th>ISBN</th><th>Stock</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {books.map(b => (
                    <tr key={b._id}>
                        <td>{b.title}</td>
                        <td>{b.author}</td>
                        <td>{b.price}</td>
                        <td>{b.isbn}</td>
                        <td>{b.stock}</td>
                        <td>
                            <button onClick={() => onEdit(b)}>Edit</button>
                            <button onClick={() => onDelete(b._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}