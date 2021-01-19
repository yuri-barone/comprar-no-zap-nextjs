import { Button, Grid, makeStyles } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

export type LocalButtonAdornmentProps = {
  lastEndereco: string,
  handleDialogOpen: () => void,
};

const useStyles = makeStyles((theme) => ({
  divAdornment: {
    width: '100%',
    height: theme.spacing(6),
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderRadius: 250,
  },
}));

const LocalButtonAdornment = ({ lastEndereco, handleDialogOpen }:LocalButtonAdornmentProps) => {
  const classes = useStyles();
  return (
    <>
      {lastEndereco && (
      <>
        <Grid item xs={6}>
          <Button
            startIcon={<LocationOnIcon />}
            size="small"
            variant="text"
            onClick={handleDialogOpen}
            color="secondary"
            fullWidth
            className={classes.divAdornment}
          >
            {lastEndereco}
          </Button>
        </Grid>
      </>
      )}
    </>
  );
};

export default LocalButtonAdornment;
