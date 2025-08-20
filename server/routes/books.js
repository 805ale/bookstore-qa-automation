// Defines CRUD API endpoints for books
// These routes are mounted under /api/books in server.js

import { Router } from "express";
import Book from "../models/Book.js";

const router = Router();

// CREATE → POST /api/books
router.post("/", async (req, res) => {
    try {
        const book = await Book.create(req.body); // insert new doc
        res.status(201).json(book);
    } catch (e) {
        res.status(400).json({ error: e.message }); // validation errors
    }
});

// READ ALL → GET /api/books
router.get("/", async (_req, res) => {
    const books = await Book.find().sort({ createdAt: -1 }); // newest first
    res.json(books);
});

// READ ONE → GET /api/books/:id
router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Not found" });
        res.json(book);
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
});

// UPDATE → PUT /api/books/:id
router.put("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,          // return updated doc
            runValidators: true // enforce schema rules on update
        });
        if (!book) return res.status(404).json({ error: "Not found" });
        res.json(book);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// DELETE → DELETE /api/books/:id
router.delete("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ error: "Not found" });
        res.json({ ok: true }); // confirm deletion
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
});

export default router;