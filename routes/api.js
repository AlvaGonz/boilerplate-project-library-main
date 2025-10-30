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
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books) => {
        if(err) {
          console.error(err);
          return res.status(500).send('Error retrieving books');
        }
        res.json(books);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(!title) {
        return res.send('missing required field title');
      }
      
      const newBook = new Book({ title: title });
      newBook.save((err, savedBook) => {
        if(err) {
          console.error(err);
          return res.status(500).send('Error saving book');
        }
        res.json({ _id: savedBook._id, title: savedBook.title });
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err) => {
        if(err) {
          console.error(err);
          return res.status(500).send('Error deleting books');
        }
        res.send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
      // Check if valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      Book.findById(bookid, (err, book) => {
        if(err) {
          console.error(err);
          return res.send('no book exists');
        }
        if(!book) {
          return res.send('no book exists');
        }
        res.json({ _id: book._id, title: book.title, comments: book.comments });
      });
    })
    
    .post(function(req, res){
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
      
      Book.findById(bookid, (err, book) => {
        if(err) {
          console.error(err);
          return res.send('no book exists');
        }
        if(!book) {
          return res.send('no book exists');
        }
        
        book.comments.push(comment);
        book.commentcount = book.comments.length;
        book.save((err, savedBook) => {
          if(err) {
            console.error(err);
            return res.status(500).send('Error saving comment');
          }
          res.json({ _id: savedBook._id, title: savedBook.title, comments: savedBook.comments });
        });
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      // Check if valid ObjectId
      if(!mongoose.Types.ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      Book.findByIdAndDelete(bookid, (err, book) => {
        if(err) {
          console.error(err);
          return res.send('no book exists');
        }
        if(!book) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      });
    });
  
};
