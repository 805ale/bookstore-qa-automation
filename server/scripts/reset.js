// server/scripts/reset.js
// Danger zone: drops/empties collections. Guarded by NODE_ENV=test.
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

const envPath = process.env.NODE_ENV === 'test' && fs.existsSync('./.env.test')
    ? './.env.test'
    : './.env';
dotenv.config({ path: envPath });

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstore_qa_test';

async function main() {
    if (process.env.NODE_ENV !== 'test') {
        console.error('Refusing to reset because NODE_ENV !== test');
        process.exit(2);
    }

    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    // Either drop the collection or deleteMany for speed on big DBs
    const collections = await db.listCollections({ name: 'books' }).toArray();
    if (collections.length) {
        await db.collection('books').deleteMany({});
        // Optionally reset indexes as well:
        // await db.collection('books').dropIndexes();
    }
    console.log('✅ books collection cleared');
    await mongoose.disconnect();
}

main().catch((e) => {
    console.error('❌ reset failed', e);
    process.exit(1);
});