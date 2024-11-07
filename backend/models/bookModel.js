import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        author: {
            type: String, 
            required: true,
        },
        publishYear: {
            type: Number,
            required: true,
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['read', 'in-progress', 'want-to-read'],
            default: 'want-to-read',
          },
    },
    {
        timestamps: true,
    }
)
export const Book = mongoose.model('book', bookSchema);