const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.listen(4001, () => {
    console.log("Comment Service listening on port 4001");
});

const commentsPerPost = {};

app.post("/posts/:id/comment", async (req, res) => {
    const id = req.params.id;
    const data = commentsPerPost[id] || [];
    const commmentId = randomBytes(4).toString('hex');
    data.push({
        id: commmentId,
        comment: req.body.comment
    });

    commentsPerPost[id] = data;

    await axios.post("http://localhost:4005/events", { type: "COMMENT_CREATED", id, commmentId, comment: req.body.comment });

    return res.status(200).send(commentsPerPost[id]);
});

app.get("/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    return res.status(200).send(commentsPerPost[id] || []);
});

app.post("/events", (req, res) => { return res.status(200).send("OK") });


