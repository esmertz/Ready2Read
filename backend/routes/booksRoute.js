import express from 'express';
import { Book } from "../models/bookModel.js";
import protect from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/books', protect, async (req, res) => {
    const { title, author, publishYear } = req.body;
  
    try {
      const book = new Book({ title, author, publishYear, userId: req.user });
      await book.save();
      res.status(201).json({ message: 'Book added successfully', book });
    } catch (error) {
      res.status(500).json({ message: 'Error adding book', error });
    }
  });

// Route for Get All Books from database
router.get('/', async (request, response) =>{
    try{
        const books = await Book.find({});

        return response.status(200).json({
            count: books.length, 
            data: books
        });

    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }

}
);

// Route for Get One Book from database by id
router.get('/:id', async (request, response) =>{
    try{
       

        const { id } = request.params;
        const book = await Book.findById(id);

        return response.status(200).json(book);

    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }

}
);

//Route to update a Book
router.put('/:id', async (request, response) =>{
    try{
        if(
            !request.body.title || !request.body.author || !request.body.publishYear
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const {id} = request.params;

        const result = await Book.findByIdAndUpdate(id, request.body);

        if(!result){
            return response.status(404).json({message: 'Book not found'});
        }
        return response.status(200).send({message: 'Book updated successfully'});

    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }

}
);

// Route to delete a book 
router.delete('/:id', async (request, response) =>{
    try{
       const {id} = request.params;

       const result = await Book.findByIdAndDelete(id);

       if(!result){
        return response.status(404).json({message: 'Book not found'});
       }

       return response.status(200).send({message: 'Book deleted successfully'});
       
    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }

}
);

router.get('/books/status/:status', async (req, res) => {
    try {
      const status = req.params.status;
      const books = await Book.find({ status });
      res.json({ data: books });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching books' });
    }
  });
  

export default router;
