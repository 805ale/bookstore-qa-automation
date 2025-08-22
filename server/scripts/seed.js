// server/scripts/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Book from '../models/Book.js';

const envPath = process.env.NODE_ENV === 'test' && fs.existsSync('./.env.test')
    ? './.env.test'
    : './.env';
dotenv.config({ path: envPath });

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore_qa_test';

const fixtures = [
    { title: 'Dune', author: 'Frank Herbert', price: 19.5, isbn: 'seed-dune', stock: 2, category: 'Sci-Fi', publishedYear: 1965 },
    { title: 'Clean Code', author: 'Robert C. Martin', price: 29.99, isbn: 'seed-clean-code', stock: 5, category: 'Non-Fiction', publishedYear: 2008 }
];

async function main() {
    if (process.env.NODE_ENV !== 'test') {
        console.error('Refusing to seed because NODE_ENV !== test');
        process.exit(2);
    }
    await mongoose.connect(uri);
    await Book.insertMany(fixtures, { ordered: false }).catch(() => { });
    console.log('✅ Seeded fixtures:', fixtures.map(f => f.isbn).join(', '));
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error('❌ seed failed', e);
    process.exit(1);
});