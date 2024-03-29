import {
  Box, Collapse, Container, Grid, IconButton, makeStyles, Paper, Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export type FaqQuestionProps = {
  question: React.ReactNode,
  answer: string,
};

const useStyles = makeStyles({
  fullHeight: {
    height: '100%',
  },
  clickable: {
    cursor: 'pointer',
  },
});

const FaqQuestion = ({ question, answer }:FaqQuestionProps) => {
  const classes = useStyles();
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
  };

  return (
    <Container className={classes.fullHeight}>
      <a onClick={handleClick} aria-hidden="true" className={classes.clickable}>
        <Paper elevation={3} className={classes.fullHeight}>
          <Box p={1}>
            <Grid container alignItems="center">
              <Grid item xs="auto">
                {!checked && (
                <IconButton onClick={handleClick}>
                  <AddIcon />
                </IconButton>
                )}
                {checked && (
                <IconButton onClick={handleClick}>
                  <RemoveIcon />
                </IconButton>
                )}
              </Grid>
              <Grid item xs>
                {question}
              </Grid>
              <Grid item xs={12}>
                <Collapse in={checked}>
                  <Box p={1}>
                    <Typography color="textSecondary">
                      {answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </a>
    </Container>
  );
};

export default FaqQuestion;
