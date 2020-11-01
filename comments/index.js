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
    const commentId = randomBytes(4).toString('hex');
    data.push({
        id: commentId,
        comment: req.body.comment,
        moderation: 'pending'
    });

    commentsPerPost[id] = data;

    await axios.post("http://localhost:4005/events", { type: "COMMENT_CREATED", id, commentId, comment: req.body.comment, moderation: 'pending' });

    return res.status(200).send(commentsPerPost[id]);
});

app.get("/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    return res.status(200).send(commentsPerPost[id] || []);
});

app.post("/events", (req, res) => {

    const { type, ...event } = req.body;
    handleEvent(type, event);

    return res.send({});
});

const handleEvent = async (type, event) => {
    switch (type) {
        case "COMMENT_MODERATED": {
            let comment = commentsPerPost[event.id].find(cm => {
                return cm.id === event.commentId;
            });
            comment.moderation = event.moderation;
            await axios.post('http://localhost:4005/events', { type: "COMMENT_UPDATED", ...event, moderation: event.moderation });

            break;
        }
    }
}


