/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const Book = require('../models/Book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await Book.find({});
        res.json(books);
      } catch(err) {
        console.error(err);
        return res.status(500).send('Error retrieving books');
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        return res.send('missing required field title');
      }
      
      try {
        const newBook = new Book({ title: title });
        const savedBook = await newBook.save();
        res.json({ _id: savedBook._id, title: savedBook.title });
      } catch(err) {
        console.error(err);
        return res.status(500).send('Error saving book');
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch(err) {
        console.error(err);
        return res.status(500).send('Error deleting books');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      // Check if valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        const book = await Book.findById(bookid);
        if(!book) {
          return res.send('no book exists');
        }
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      } catch(err) {
        console.error(err);
        return res.send('no book exists');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if(!comment) {
        return res.send('missing required field comment');
      }
      
      // Check if valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        const book = await Book.findById(bookid);
        if(!book) {
          return res.send('no book exists');
        }
        
        book.comments.push(comment);
        book.commentcount = book.comments.length;
        const savedBook = await book.save();
        res.json({ _id: savedBook._id, title: savedBook.title, comments: savedBook.comments });
      } catch(err) {
        console.error(err);
        return res.send('no book exists');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      // Check if valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if(!book) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      } catch(err) {
        console.error(err);
        return res.send('no book exists');
      }
    });
  
};
