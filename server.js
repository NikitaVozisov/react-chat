const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Chatkit = require('pusher-chatkit-server');

const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:cc182ae6-f510-4f78-b25f-207c9fb3f9b1',
    key: '07858057-d89f-4911-bbc2-dbaad334e34e:kyIFolY8MyFG0jRyKunK2vUUmXcUL1hZTbi8Yd3FZs8='
});
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/users', (req, res) => {
    const { username } = req.body;
    const user = { name: username, id: username };
    chatkit
        .createUser(user)
        .then(() => {
            console.log('Created user ', user.name);
            res.status(201).json(user)
        })
        .catch(error => {
            if (error.error === 'services/chatkit/user_already_exists') {
                console.log('User already exists ', user.name);
                res.status(201).json(user)
            } else {
                console.error(error);
                res.status(error.status).json(error)
            }
        })
});

app.listen(3001);
console.log('Running on port 3001');