import express from 'express';
import { Book } from "../models/bookModel.js";
import protect from '../middleware/authMiddleware.js'; // Middleware for authentication

const router = express.Router();

// Route to add a new book
router.post('/books', protect, async (req, res) => {
  const { title, author, publishYear } = req.body; // Destructuring the necessary fields from request body
  
  try {
    // Create a new book instance and associate it with the current user (via req.user)
    const book = new Book({ 
      title, 
      author, 
      publishYear, 
      userId: req.user // assuming 'req.user' contains the authenticated user's ID
    });
    
    // Save the new book to the database
    await book.save();
    
    // Return a success response with the added book
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    // In case of any error, return a 500 error status with the error message
    res.status(500).json({ message: 'Error adding book', error });
  }
});

// Route to get all books from the database
router.get('/', async (request, response) => {
  try {
    // Find all books in the database
    const books = await Book.find({});
    
    // Send the list of books with a count
    return response.status(200).json({
      count: books.length,
      data: books
    });
  } catch (error) {
    // Log the error and send a 500 status in case of failure
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get a single book by its ID
router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params; // Extract the ID from the URL params
    
    // Find the book by its ID
    const book = await Book.findById(id);
    
    // Return the book data if found
    return response.status(200).json(book);
  } catch (error) {
    // Log and send error message in case of failure
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to update a book by its ID
router.put('/:id', async (request, response) => {
  try {
    // Check if all required fields (title, author, publishYear) are provided
    if (!request.body.title || !request.body.author || !request.body.publishYear) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const { id } = request.params; // Extract the ID from the URL params

    // Update the book with the new data from the request body
    const result = await Book.findByIdAndUpdate(id, request.body, { new: true });

    // If no book is found to update, return a 404 error
    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    // Return success message
    return response.status(200).send({ message: 'Book updated successfully' });
  } catch (error) {
    // Log the error and return a 500 error in case of failure
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to delete a book by its ID
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params; // Extract the ID from the URL params

    // Find and delete the book by its ID
    const result = await Book.findByIdAndDelete(id);

    // If the book is not found, return a 404 error
    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    // Return success message
    return response.status(200).send({ message: 'Book deleted successfully' });
  } catch (error) {
    // Log the error and return a 500 error in case of failure
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route to get books by status (e.g., 'read', 'in-progress', 'want-to-read')

router.get('/books/status/:status', protect, async (req, res) => { // Added protect middleware
  try {
    const status = req.params.status;
    const userId = req.user; // Get the userId from the authenticated user

    // Find books with the given status AND userId
    const books = await Book.find({ status, userId }); 

    res.json({  books });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});


export default router;
