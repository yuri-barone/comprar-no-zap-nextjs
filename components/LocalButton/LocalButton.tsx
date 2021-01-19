import { Grid, Link, makeStyles } from '@material-ui/core';
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
});

const LocalButton = ({ lastEndereco, handleDialogOpen }:LocalButtonProps) => {
  const classes = useStyles();

  return (
    <>
      {lastEndereco && (
      <>
        <Grid item xs={12}>
          <Link onClick={handleDialogOpen} color="primary" className={classes.link}>
            <LocationOnIcon />
            {lastEndereco}
          </Link>
        </Grid>
      </>
      )}
    </>
  );
};

export default LocalButton;
