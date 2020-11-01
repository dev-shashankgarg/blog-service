const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(4003, () => {
    console.log("Moderation service listening on port 4003");
});

const handleEvent = async (type, event) => {
    switch (type) {
        case "COMMENT_CREATED": {
            const status = event.comment.includes('hate') ? 'rejected' : 'approved';
            await axios.post('http://localhost:4005/events', { type: "COMMENT_MODERATED", ...event, moderation: status });

            break;
        }
    }
}

app.post("/events", (req, res) => {
    const { type, ...event } = req.body;
    handleEvent(type, event);

    return res.send({});
})

