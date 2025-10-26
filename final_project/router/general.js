const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Hint: The code should take the ‘username’ and ‘password’ provided in the body of the request for registration. If the username already exists, it must mention the same & must also show other errors like eg. when username &/ password are not provided.
  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered"});
    }
    else{
      return res.status(409).json({message: "Username already exists"});
    }
  }
  else{
    return res.status(400).json({message: "Unable to register user. Please provide both username and password"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((books) => {
    return res.status(200).json(books);
  });
}
);

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if(books[isbn]){
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN.then((book) => {
    return res.status(200).json(book);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    let results = [];
    for(let isbn in books){
      if(books[isbn].author.toLowerCase() === author.toLowerCase()){
        results.push(books[isbn]);
      }
    }
    if(results.length > 0){
      resolve(results);
    } else {
      reject("No books found by this author");
    }
  });

  getBooksByAuthor.then((books) => {
    return res.status(200).json(books);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  const getBooksByTitle = new Promise((resolve, reject) => {
    let results = [];
    for(let isbn in books){
      if(books[isbn].title.toLowerCase() === title.toLowerCase()){
        results.push(books[isbn]);
      }
    }
    if(results.length > 0){
      resolve(results);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle.then((books) => {
    return res.status(200).json(books);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]){
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
