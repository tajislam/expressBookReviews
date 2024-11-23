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
  // Why are we using return??
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(400).json({message: `User ${username} already exists! Cannot register again.`});//message is taken as a literal
      }
  }
  // Return error if username or password is missing
  return res.status(400).json({message: "Unable to register user."});
 //return res.status(300).json({message: "Yet to be implemented"});
});
//Different ways of handling Promise.then().catch() are shown
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let listBooksPromise = new Promise((resolve,reject) => {
    try{
      booksJSON = JSON.stringify(books,null,4);
      resolve(booksJSON);
    }
    catch(err){reject(err);}
  });
  listBooksPromise
    .then((bookList)=>{
       res.send(bookList);
      })
    .catch(err => {res.status(400).json({message: err});});
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let getBookPromise = new Promise((resolve,reject) => {
    isbn = req.params.isbn;
    if (books[isbn])
      resolve(books[isbn]);
    else
      reject(`Book with ISBN ${isbn} not found`);
  });
  getBookPromise.then((book)=>{res.send(book);  }, 
                      (errmsg) =>{res.status(404).json({message: errmsg})});
 
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let getBookByAuthorPromise = new Promise((resolve,reject) => {
    function doGruntWork(author){  
      //author = req.params.author;
      isbns = Object.keys(books);
      booksByAuthor = [];
      isbns.forEach((isbn) => {
        if (books[isbn].author === author)
            booksByAuthor.push({[isbn]:books[isbn]});
      });
      return(booksByAuthor);
    }
    //----
    setTimeout(()=>{reject("Timed Out");}, 2000);//Could not test this
    booksByAuthor = doGruntWork(req.params.author);
    if (booksByAuthor.length >= 1)
      resolve(booksByAuthor);
    else
      reject(`No books found for author ${req.params.author}. Try with a different author`);
  });
  getBookByAuthorPromise
  .then((books)=>{ res.send(books);}, 
        (errmsg)=>{res.status(404).json({message: errmsg})});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //If no title is provided it does not reach here. Rejected by the router!
  //Write your code here
  let getBookByTitlePromise = new Promise((resolve,reject) => {
    function doGruntWork(title){  
      
      isbns = Object.keys(books);
      booksOfTitle = [];
      isbns.forEach((isbn) => {
         if (books[isbn].title === title)
         booksOfTitle.push({[isbn]:books[isbn]});
      });
      return (booksOfTitle);
    }
    //----
    setTimeout(()=>{reject("Timed Out");}, 2000);
    title = req.params.title;
    booksWithRequestedTitle = doGruntWork(title);
    //When nothing is found you could regard that as a success also, but here it is error
    if (booksWithRequestedTitle.length >= 1)
        resolve(booksWithRequestedTitle);
    else
        reject(`Books with title ${title} not found. Try a different title`);
  });
  getBookByTitlePromise
    .then((books)=>{res.send(books);})
    .catch((errmsg) => {res.status(404).json({message: errmsg})});
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  isbn = req.params.isbn;
  b = books[isbn];
  if (b)
      res.send({[b.title] : b.reviews});
  else
      res.send({message : `Book with ISBN ${isbn} not found`});
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
