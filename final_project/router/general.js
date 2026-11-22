
const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Check if user already exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    return userswithsamename.length > 0;
};

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });
        } else {
            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});

// Task 3: Get books by Author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = {};

    for (let isbn in books) {
        if (books[isbn].author === author) {
            result[isbn] = books[isbn];
        }
    }

    res.send(result);
});

// Task 4: Get books by Title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};

    for (let isbn in books) {
        if (books[isbn].title === title) {
            result[isbn] = books[isbn];
        }
    }

    res.send(result);
});

// Task 5: Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        res.send(books[isbn].reviews);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});

// --------------------------------------------
// Tasks 10-13: Async-await with Axios
// --------------------------------------------

const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using Axios
async function getAllBooks() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log("Task 10 - All Books:", response.data);
        return response.data;
    } catch (error) {
        console.error("Task 10 Error:", error.message);
    }
}

// Task 11: Get book details by ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(
            `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
        );

        console.log("Task 11 - Book by ISBN:", response.data);
        return response.data;
    } catch (error) {
        console.error("Task 11 Error:", error.message);
    }
}

// Task 12: Get books by Author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(
            `${BASE_URL}/author/${encodeURIComponent(author)}`
        );

        console.log("Task 12 - Books by Author:", response.data);
        return response.data;
    } catch (error) {
        console.error("Task 12 Error:", error.message);
    }
}

// Task 13: Get books by Title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(
            `${BASE_URL}/title/${encodeURIComponent(title)}`
        );

        console.log("Task 13 - Books by Title:", response.data);
        return response.data;
    } catch (error) {
        console.error("Task 13 Error:", error.message);
    }
}

// Export router and Axios functions
module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
