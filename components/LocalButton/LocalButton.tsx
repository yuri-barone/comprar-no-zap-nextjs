import {
  Grid, Link, makeStyles, Typography,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

export type LocalButtonProps = {
  lastEndereco: string,
  handleDialogOpen: () => void,
};

const useStyles = makeStyles({
  link: {
    cursor: 'pointer',
    fontFamily: 'Roboto',
  },
  icon: {
    marginBottom: '-5px',
  },
});

const LocalButton = ({ lastEndereco, handleDialogOpen }:LocalButtonProps) => {
  const classes = useStyles();

  return (
    <>
      {lastEndereco && (
      <>
        <Grid item xs={12}>
          <Typography>
            <Link onClick={handleDialogOpen} color="primary" className={classes.link}>
              <LocationOnIcon className={classes.icon} />
              {lastEndereco}
            </Link>
          </Typography>
        </Grid>
      </>
      )}
    </>
  );
};

export default LocalButton;
