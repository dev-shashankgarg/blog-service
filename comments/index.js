const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.listen(4001, () => {
    console.log("Listening on port 4001");
});

const commentsPerPost = {};

app.post("/posts/:id/comment", (req, res) => {
    const id = req.params.id;
    const data = commentsPerPost[id] || [];
    const commmentId = randomBytes(4).toString('hex');
    data.push({
        id: commmentId,
        comment: req.body.comment
    });

    commentsPerPost[id] = data;
    return res.status(200).send(commentsPerPost[id]);
});

app.get("/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    return res.status(200).send(commentsPerPost[id] || []);
});

