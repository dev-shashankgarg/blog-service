import React from 'react'
import axios from 'axios'
import { TextField, Grid, Fab } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';


const PostCreate = (props) => {

    const [title, setTitle] = React.useState('');

    const onCreate = async (event) => {
        if (title) {
            const response = await axios.post("http://localhost:4000/posts", { title });
            props.onCreate();
            setTitle('');
        }
    }

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item sm={6}>
                <TextField
                    id="create-post-tf-id"
                    label="Post Title"
                    helperText={"Create a new post with a new title"}
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={title}
                    onChange={(event => {
                        setTitle(event.target.value);
                    })}
                />
            </Grid>
            <Grid item sm={2}>
                <Fab color="primary" aria-label="add" size="small" onClick={onCreate}>
                    <CreateIcon />
                </Fab>
            </Grid>

        </Grid>)
}

export default PostCreate