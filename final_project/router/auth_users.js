const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
// Return true if any valid user is found, otherwise false
  return (validusers.length > 0) ;

//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60*10 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
   isbn = req.params.isbn;
   b = books[isbn];
   review = req.body.review;
   u = req.session.authorization.username;
   if (b.reviews[u]){//update 
       b.reviews[u] = review;
       res.send(`Review updated. User ${u}; ISBN ${isbn}`);
   }
   else{ //add
       b.reviews[u] = review;
       res.send(`New review added. User ${u}; ISBN ${isbn}`);
   }

  //return res.status(300).json({message: "Yet to be implemented"});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  isbn = req.params.isbn;
  b = books[isbn];
  review = req.body.review;
  u = req.session.authorization.username;
  if (b.reviews[u]){//Delete
      delete b.reviews[u];
      res.send(`Review deleted. User ${u}; ISBN ${isbn}`);
  }
  else{ //add    
      res.send(`No review found. Nothing deleted! User ${u}; ISBN ${isbn}`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
