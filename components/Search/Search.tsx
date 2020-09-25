import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    minHeight: "100vh",
    display: "flex",
  },
  searchField: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
  },
}));

function Search() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="center">
            <Box p={2}>
              <Grid item>
                <Typography variant="h4">AskZap</Typography>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item>
              <Paper className={classes.searchField}>
                <Grid container spacing={2}>
                <Grid item xs={2}>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={8}>
                  <TextField id="searchField" label="Procurar produtos" variant="outlined"/>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}></Grid>

        <Grid item xs={12}></Grid>
      </Grid>
    </div>
  );
}

export default Search;
