const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the api'
    });
});

// We are going to add a middleware function to the route we want to protect

app.post('/api/post', verifyToken,  (req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

// we need a way to get the token, you can do it synchronously or asynchronously.

app.post('/api/login', (req, res) => {
    // Mock user, but normally you have to send your useranme and password, it goes throuhg all the authentication process, then your get your user back. 
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com' 
    }
    // we have to pass in the user to jwt.sign function, then it returns the token
    jwt.sign({user}, 'secretkey', {expiresIn: '30s'}, (err, token) => {
       res.json({
           token
       }); 
    });
});

// Format of token
// Authorization: Bearer <access_token>
// Verify token
function verifyToken(req, res, next){
    // Get auth header value, the token is sent through the request header, authorization value.
    // We Want to send the token in the header as authorization value.  
    const bearerHeader = req.headers['authorization'];

    // Check if bearer is undefined, what if we use if(bearerHeader) instead. 
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // We can get token from arry
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Call the next middleware
        next();         
    } else {
        // Forbidden
        res.sendStatus(403);
    }
};

const test = "the game is on"
const test2 = test.split(' ');
console.log(test2[1]);

app.listen(5000, () => console.log('Server started on port 5000'));