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

    const loadComments = async (ids) => {
        let data = {};
        for (let index = 0; index < ids.length; index++) {
            let comments = await axios.get(`http://localhost:4001/posts/${ids[index]}/comments`);
            data[ids[index]] = comments.data;
        }
        setComments(data);
    }

    const [comments, setComments] = React.useState({});
    const [nComment, setNComment] = React.useState({});

    React.useEffect(() => {
        loadComments(props.posts.map(post => post.id));
    }, [props.posts])

    const handleAddComment = (postId) => async () => {
        if (nComment[postId]) {
            await axios.post(`http://localhost:4001/posts/${postId}/comment`, { 'comment': nComment[postId] });
            loadComments(props.posts.map(post => post.id));
            setNComment({ ...nComment, [postId]: '' });
        }
    }

    return (
        <Grid container spacing={1}>
            {
                props.posts.map(post => {
                    return (
                        <Grid item sm={2} key={post.id}>
                            <Paper className={classes.postCard} variant="outlined">
                                <Grid container className={classes.postTitleContainer}>
                                    <Grid item sm={2}>
                                        <BookIcon style={{ color: "white" }} />
                                    </Grid>
                                    <Grid item sm={10}>
                                        <Typography className={classes.postTitle}>{post.title.toUpperCase()}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} justify="space-evenly">
                                    <Grid item sm={12} style={{ paddingLeft: "8px" }}>
                                        <Typography variant="overline">{`Comments: ${comments[post.id] ? comments[post.id].length : 0}`}</Typography>
                                    </Grid>
                                    <Grid item sm={12} className={classes.commentDisplayContainer}>
                                        <List dense >
                                            {
                                                (comments[post.id] || []).map(comment => {
                                                    return <ListItem key={comment.id} dense divider>
                                                        <ListItemIcon>
                                                            <ChatIcon />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={comment.comment}
                                                        />
                                                    </ListItem>
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
                                            value={nComment[post.id] || ''}
                                            onChange={(event => {
                                                setNComment({ ...nComment, [post.id]: event.target.value });
                                            })}
                                        />
                                    </Grid>
                                    <Grid item sm={3}>
                                        <Fab color="primary" aria-label="add" size="small" onClick={handleAddComment(post.id)} >
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

export default PostCards;