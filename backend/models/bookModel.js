import mongoose from "mongoose";

// Define the schema for the Book model
const bookSchema = mongoose.Schema(
    {
        // The title field is required and stores the title of the book
        title: {
            type: String,
            required: true,
        },

        // The author field is required and stores the name of the author of the book
        author: {
            type: String,
            required: true,
        },

        // The publishYear field is required and stores the year the book was published
        publishYear: {
            type: Number,
            required: true,
        },

        // The userId field is a reference to the User model (stored as an ObjectId)
        // This field links each book to the user who added it (Required)
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',  // Reference to the User model (important for MongoDB to establish a relationship between the two)
            required: true,
        },

        // The status field indicates the reading status of the book.
        // It can be one of the following values: 'read', 'in-progress', 'want-to-read'
        // The default value is 'want-to-read'
        status: {
            type: String,
            enum: ['read', 'in-progress', 'want-to-read'], // Limits the allowed values for the status field
            default: 'want-to-read', // Default value when the status is not specified
        },
    },
    {
        // Automatically adds `createdAt` and `updatedAt` timestamps
        timestamps: true,
    }
);

// Create and export the Book model based on the schema
// The 'book' is the collection name in the MongoDB database
export const Book = mongoose.model('book', bookSchema);
