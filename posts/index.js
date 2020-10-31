const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post("/posts", async (req, res) => {

    const id = randomBytes(4).toString("hex")
    const { title } = req.body

    posts[id] = { id, title }

    await axios.post("http://localhost:4005/events", { type: "POST_CREATED", id, title });

    return res.status(201).send(posts[id]);
})

app.get("/posts", (req, res) => {
    return res.status(200).send(posts);
})

app.post("/events", (req, res) => { return res.status(200).send("OK") });

app.listen(4000, () => {
    console.log('Post Service listening on port 4000')
})