// Defines the Book model for MongoDB using Mongoose

import mongoose from "mongoose";

// Schema = structure of the "books" collection
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isbn: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, required: true, min: 0 },

    // 🔽 New fields (must come after a comma!)
    category: {
        type: String,
        enum: ["Fantasy", "Sci-Fi", "Romance", "Non-Fiction", "Other"],
        default: "Other"
    },
    publishedYear: { type: Number, min: 0 }
}, { timestamps: true });


// Export the model → creates "books" collection in MongoDB
export default mongoose.model("Book", bookSchema);