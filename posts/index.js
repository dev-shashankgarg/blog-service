const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post("/posts", (req, res) => {

    const id = randomBytes(4).toString("hex")
    const { title } = req.body

    posts[id] = { id, title }

    return res.status(201).send(posts[id]);
})

app.get("/posts", (req, res) => {
    return res.status(200).send(posts);
})

app.listen(4000, () => {
    console.log('Listening on port 4000')
})