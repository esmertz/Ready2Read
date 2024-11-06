import express, { request, response } from "express";
import {PORT, mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import booksRoute from './routes/booksRoute.js'
import cors from 'cors';

const app = express();

// Middleware for parsing request body
app.use(express.json());


//Middleware for handling CORS Policy
app.use(cors());

app.get('/', (request, response)=>{
    console.log(request)
    return response.status(234).send('Ready2Read')
});

app.use('/books', booksRoute);

mongoose
    .connect(mongoDBURL)
    .then(() =>{
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error) =>{
        console.log(error);
        
    });