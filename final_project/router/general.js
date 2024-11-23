const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  const doesExist = (username) => {
      // Filter the users array for any user with the same username
      let userswithsamename = users.filter((user) => {
          return user.username === username;
      });
      // Return true if any user with the same username is found, otherwise false
      if (userswithsamename.length > 0) {
          return true;
      } else {
          return false;
      }
  }
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});//message is taken as a literal
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
 //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let listBooksPromise = new Promise((resolve,reject) => {
      resolve("Got Books");
  });
  listBooksPromise.then((success)=>{
    res.send(JSON.stringify(books,null,4));
  });
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let getBookPromise = new Promise((resolve,reject) => {
    resolve("Got Book");
  });
  getBookPromise.then((success)=>{
    isbn = req.params.isbn;
    res.send(books[isbn]);
  });
 
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let getBookByAuthorPromise = new Promise((resolve,reject) => {
    function doGruntWork(){  
      author = req.params.author;
      isbns = Object.keys(books);
      booksByAuthor = [];
      isbns.forEach((isbn) => {
        if (books[isbn].author === author)
            booksByAuthor.push({[isbn]:books[isbn]});
      });
      res.send(booksByAuthor);
    }
    //----
    setTimeout(()=>{reject("Timed Out");}, 2000);//Could not test this
    doGruntWork();
    resolve("listing of books by author all done");
  });
  getBookByAuthorPromise
  .then((success)=>{
    console.log(success);
    //res.send(success);
  })
  .catch((err)=>{res.send(err)});

  //Write your code here

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let getBookByTitlePromise = new Promise((resolve,reject) => {
    function doGruntWork(){  
      title = req.params.title;
      isbns = Object.keys(books);
      booksOfTitle = [];
      isbns.forEach((isbn) => {
         if (books[isbn].title === title)
         booksOfTitle.push({[isbn]:books[isbn]});
      });
      res.send(booksOfTitle);
    }
    //----
    setTimeout(()=>{reject("Timed Out");}, 2000);
    doGruntWork();
    resolve("Books by title all done");
  });
  getBookByTitlePromise
  .then((success)=>{
    console.log (success);
    //res.send(success); //Cannot set headers after they are sent to the client
  })
  .catch((err)=>{res.send(err)});

 
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  isbn = req.params.isbn;
  res.send({[books[isbn].title] : books[isbn].reviews});
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
