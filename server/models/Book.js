// Defines the Book model for MongoDB using Mongoose

import mongoose from "mongoose";

// Schema = structure of the "books" collection
const BookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },   // book title
        author: { type: String, required: true },  // author name
        price: { type: Number, required: true, min: 0 }, // must be ≥ 0
        isbn: { type: String, unique: true, required: true }, // unique book identifier
        stock: { type: Number, default: 0, min: 0 } // how many copies available
    },
    { timestamps: true } // adds createdAt & updatedAt automatically
);

// Export the model → creates "books" collection in MongoDB
export default mongoose.model("Book", BookSchema);