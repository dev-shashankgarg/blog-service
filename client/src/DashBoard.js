import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'

import PostCreate from './posts/PostCreate'
import PostCards from './posts/PostCards'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2)
    },
    postCreateContainer: {
        padding: theme.spacing(2)
    }
}))

const DashBoard = () => {
    const classes = useStyles();

    const getAllPosts = async () => {
        const posts = await axios.get("http://localhost:4002/posts");
        setPosts(posts.data);
    }

    const [posts, setPosts] = React.useState({});

    React.useEffect(() => {
        getAllPosts();
    }, []);

    const handleOnCreate = () => {
        getAllPosts();
    }

    return (
        <Grid container className={classes.container} spacing={2} justify="center">
            <Grid item sm={12} >
                <Paper elevation={6} className={classes.postCreateContainer}>
                    <PostCreate onCreate={handleOnCreate} />
                </Paper>
            </Grid>
            <Grid item sm={12} >
                <PostCards posts={posts} onCreate={handleOnCreate} />
            </Grid>
        </Grid>
    )
}


export default DashBoard;