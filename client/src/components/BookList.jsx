import React from 'react';

export default function BookList({ books, onEdit, onDelete }) {
    if (!books?.length) return <p>No books yet</p>;

    return (
        <table aria-label="book-table" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 1000 }}>
            <thead>
                <tr>
                    <Th>Title</Th>
                    <Th>Author</Th>
                    <Th>Price</Th>
                    <Th>ISBN</Th>
                    <Th>Stock</Th>
                    <Th>Category</Th>
                    <Th>Year</Th>
                    <Th>Actions</Th>
                </tr>
            </thead>
            <tbody>
                {books.map(b => (
                    <tr key={b._id}>
                        <Td>{b.title}</Td>
                        <Td>{b.author}</Td>
                        <Td>{Number(b.price).toFixed(2)}</Td>
                        <Td>{b.isbn}</Td>
                        <Td>{b.stock}</Td>
                        <Td>{b.category ?? 'Other'}</Td>
                        <Td>{b.publishedYear ?? ''}</Td>
                        <Td>
                            <button onClick={() => onEdit(b)} style={{ marginRight: 6 }}>Edit</button>
                            <button onClick={() => onDelete(b._id)}>Delete</button>
                        </Td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Th({ children }) {
    return <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '6px 8px' }}>{children}</th>;
}
function Td({ children }) {
    return <td style={{ borderBottom: '1px solid #eee', padding: '6px 8px' }}>{children}</td>;
}