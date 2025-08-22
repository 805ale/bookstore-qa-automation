import { test, expect } from '@playwright/test';
import { resetDb, createBook } from './helpers';

test.beforeEach(async ({ request }) => {
    await resetDb(request);
});

test.describe('Bookstore CRUD (UI)', () => {

    test('create → appears in table', async ({ page }) => {
        await page.goto('/');

        await page.getByPlaceholder('Title').fill('Clean Code');
        await page.getByPlaceholder('Author').fill('Robert C. Martin');
        await page.getByPlaceholder('Price').fill('29.99');
        await page.getByPlaceholder('ISBN').fill('9780132350884');
        await page.getByPlaceholder('Stock').fill('5');
        await page.getByLabel('Category').selectOption('Non-Fiction');
        await page.getByPlaceholder('Published Year (optional)').fill('2008');

        await page.getByRole('button', { name: /Add Book/i }).click();

        await expect(page.getByRole('cell', { name: 'Clean Code' })).toBeVisible();
        await expect(page.getByRole('cell', { name: 'Non-Fiction' })).toBeVisible();
        await expect(page.getByRole('cell', { name: '2008' })).toBeVisible();
    });

    test('edit → stock updated', async ({ page, request }) => {
        await createBook(request, { title: 'Dune', author: 'Frank Herbert', price: 19.5, isbn: '9780441172719', stock: 2, category: 'Sci-Fi', publishedYear: 1965 });

        await page.goto('/');
        const duneRow = page.getByRole('row', { name: /Dune/ });
        await duneRow.getByRole('button', { name: 'Edit' }).click();

        const stockInput = page.getByPlaceholder('Stock');
        await stockInput.fill('10');

        await page.getByRole('button', { name: /Update Book/i }).click();

        await expect(page.getByRole('row', { name: /Dune/ })).toContainText('10');
    });

    test('duplicate ISBN → inline error banner', async ({ page }) => {
        await page.goto('/');

        // First create
        await page.getByPlaceholder('Title').fill('Once Upon a Broken Heart');
        await page.getByPlaceholder('Author').fill('Stephanie Garber');
        await page.getByPlaceholder('Price').fill('14.99');
        await page.getByPlaceholder('ISBN').fill('dup-123');
        await page.getByPlaceholder('Stock').fill('5');
        await page.getByLabel('Category').selectOption('Romance');
        await page.getByRole('button', { name: /Add Book/i }).click();

        // Attempt duplicate
        await page.getByPlaceholder('Title').fill('Duplicate');
        await page.getByPlaceholder('Author').fill('Test');
        await page.getByPlaceholder('Price').fill('10');
        await page.getByPlaceholder('ISBN').fill('dup-123');
        await page.getByPlaceholder('Stock').fill('1');
        await page.getByRole('button', { name: /Add Book/i }).click();

        // Our App.jsx shows a red banner div on error; assert it exists
        const banner = page.getByRole('alert');
        await expect(banner).toBeVisible();
        await expect(banner).toContainText(/(duplicate|E11000|HTTP 400)/i);
    });

    test('delete flow → row disappears', async ({ page, request }) => {
        await createBook(request, { title: 'Daughter of the Moon Goddess', author: 'Sue Lynn Tan', price: 15.99, isbn: 'moon-9780000003001', stock: 6, category: 'Fantasy', publishedYear: 2022 });

        await page.goto('/');

        const row = page.getByRole('row', { name: /Daughter of the Moon Goddess/ });
        await expect(row).toBeVisible();

        await row.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByRole('cell', { name: /Daughter of the Moon Goddess/ })).toHaveCount(0);
    });

});

