import { APIRequestContext, expect } from '@playwright/test';

/** Pull API base URL from env or default */
export const API = process.env.API_BASE_URL ?? 'http://localhost:2000';

/** Delete ALL books (test-only convenience) */
export async function resetDb(request: APIRequestContext) {
    // List then delete 1-by-1 — safe for our simple app
    const list = await request.get(`${API}/api/books`);
    expect(list.ok()).toBeTruthy();
    const books = await list.json();
    await Promise.all(
        (books as any[]).map(b => request.delete(`${API}/api/books/${b._id}`))
    );
}

/** Create a book via API; returns created document */
export async function createBook(request: APIRequestContext, override: Partial<any> = {}) {
    const payload = {
        title: 'Test Title',
        author: 'Test Author',
        price: 10.5,
        isbn: `test-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        stock: 1,
        category: 'Other',
        ...override,
    };
    const res = await request.post(`${API}/api/books`, { data: payload });
    expect(res.ok()).toBeTruthy();
    return res.json();
}
