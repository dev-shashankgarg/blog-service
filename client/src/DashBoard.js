import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'

import PostCreate from './posts/PostCreate'

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

    return (
        <Grid container className={classes.container} spacing={2} justify="center">
            <Grid item sm={12} >
                <Paper elevation={6} className={classes.postCreateContainer}>
                    <PostCreate />
                </Paper>
            </Grid>

        </Grid>
    )
}


export default DashBoard;