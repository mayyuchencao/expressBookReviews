const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check whether username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Check whether username and password match
const authenticatedUser = (username, password) => {
    return users.some(user =>
        user.username === username &&
        user.password === password
    );
};

// Login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username) && authenticatedUser(username, password)) {

        // Generate JWT
        const accessToken = jwt.sign(
            { username: username },
            "access",
            { expiresIn: "1h" }
        );

        // Store JWT in session
        req.session.authorization = {
            accessToken: accessToken
        };

        return res.status(200).json({
            message: "User successfully logged in"
        });
    }

    return res.status(401).json({
        message: "Invalid username or password"
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;