// Main entry point for the backend API

import express from "express";   // Web framework for Node.js
import mongoose from "mongoose"; // MongoDB ODM (Object Data Mapper)
import cors from "cors";         // Middleware to allow cross-origin requests
import dotenv from "dotenv";     // Loads environment variables from .env
import booksRouter from "./routes/books.js"; // Routes for CRUD on books
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Enable CORS so frontend (different port) can talk to backend
app.use(cors());

// Parse JSON bodies automatically
app.use(express.json());

// Get config values from environment or use defaults
const PORT = process.env.PORT || 2000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore_qa";

// Health check endpoint (so we can test the server is alive)
app.get("/", (_req, res) => res.json({ ok: true, service: "bookstore-api" }));

// Mount the books router → all routes inside start with /api/books
app.use("/api/books", booksRouter);

// Connect to MongoDB, then start the Express server
mongoose
    .connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () =>
            console.log(`Server running at http://localhost:${PORT}`)
        );
    })
    .catch((err) => {
        console.error("Mongo connection error:", err);
        process.exit(1); // Exit process if DB connection fails
    });


if (process.env.NODE_ENV === 'test' && fs.existsSync('.env.test')) {
    dotenv.config({ path: '.env.test' });
} else {
    dotenv.config();
}
