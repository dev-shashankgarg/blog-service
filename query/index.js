const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(4002, async () => {
    console.log("Query Service listening on port 4002");

    const response = await axios.get('http://localhost:4005/events');
    response.data.forEach(res => {
        const { type, ...event } = res;
        handleEvent(type, event);
    })
});

const posts = {};

app.get("/posts", (req, res) => {
    return res.status(200).send(posts);
});

app.post("/events", (req, res) => {
    const { type, ...event } = req.body;
    handleEvent(type, event);
    return res.status(201).send(event);
});

const handleEvent = (type, event) => {
    switch (type) {
        case "POST_CREATED": {
            posts[event.id] = ({
                id: event.id,
                title: event.title,
                comments: []
            });
            break;
        }
        case "COMMENT_CREATED": {
            posts[event.id].comments.push({ id: event.commentId, comment: event.comment, moderation: event.moderation });
            break;
        }
        case "COMMENT_UPDATED": {
            let comment = posts[event.id].comments.find(cm => cm.id === event.commentId);
            comment.moderation = event.moderation;
            break;
        }
    }
}