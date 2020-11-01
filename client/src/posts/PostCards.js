import React from 'react'
import { Grid, Paper, Typography, TextField, Fab } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import BookIcon from '@material-ui/icons/Book';
import CreateIcon from '@material-ui/icons/Create';
import ChatIcon from '@material-ui/icons/Chat';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import purple from '@material-ui/core/colors/purple';
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    postCard: {
        height: "400px",
        maxHeight: "4000px",
        overflowY: "scroll"
    },
    postTitleContainer: {
        height: "60px",
        maxHeight: "60px",
        overflowY: "scroll",
        padding: theme.spacing(1),
        backgroundColor: purple[500]
    },
    commentDisplayContainer: {
        padding: theme.spacing(1),
        height: "240px",
        maxHeight: "240px",
        overflowY: "scroll"
    },
    commentAddContainer: {
        padding: theme.spacing(1)
    },
    postTitle: {
        fontFamily: "sans-serif",
        fontSize: "16px",
        fontWeight: "300",
        color: "white"
    }
}));

const PostCards = (props) => {

    const classes = useStyles();
    const [nComment, setNComment] = React.useState({});

    const handleAddComment = (postId) => async () => {
        if (nComment[postId]) {
            await axios.post(`http://localhost:4001/posts/${postId}/comment`, { 'comment': nComment[postId] });
            props.onCreate();
            setNComment({ ...nComment, [postId]: '' });
        }
    }

    return (
        <Grid container spacing={1}>
            {
                Object.keys(props.posts).map(id => {
                    return (
                        <Grid item sm={2} key={id}>
                            <Paper className={classes.postCard} variant="outlined">
                                <Grid container className={classes.postTitleContainer}>
                                    <Grid item sm={2}>
                                        <BookIcon style={{ color: "white" }} />
                                    </Grid>
                                    <Grid item sm={10}>
                                        <Typography className={classes.postTitle}>{props.posts[id].title.toUpperCase()}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} justify="space-evenly">
                                    <Grid item sm={12} style={{ paddingLeft: "8px" }}>
                                        <Typography variant="overline">{`Comments: ${props.posts[id].comments.length}`}</Typography>
                                    </Grid>
                                    <Grid item sm={12} className={classes.commentDisplayContainer}>
                                        <List dense >
                                            {
                                                (props.posts[id].comments).map(comment => {
                                                    return (<ListItem key={comment.id} dense divider>
                                                        <ListItemIcon>
                                                            <ChatIcon />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={getComment(comment.comment, comment.moderation)}
                                                        />
                                                    </ListItem>)
                                                })
                                            }
                                        </List>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} className={classes.commentAddContainer}>
                                    <Grid item sm={9}>
                                        <TextField
                                            id="create-comment-tf-id"
                                            label="Comment"
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            value={nComment[id] || ''}
                                            onChange={(event => {
                                                setNComment({ ...nComment, [id]: event.target.value });
                                            })}
                                        />
                                    </Grid>
                                    <Grid item sm={3}>
                                        <Fab color="primary" aria-label="add" size="small" onClick={handleAddComment(id)} >
                                            <CreateIcon />
                                        </Fab>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>)
                })
            }
        </Grid>)
}

const getComment = (content, status) => {
    switch (status) {
        case "pending": { return (<i>this comment is pending moderation </i>); }
        case "rejected": { return (<strike>this comment is deleted </strike>); }
        case "approved": return content;
    }
}

export default PostCards;