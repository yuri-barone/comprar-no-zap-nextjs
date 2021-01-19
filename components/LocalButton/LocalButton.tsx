import { Button, Grid } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React from 'react';

export type LocalButtonProps = {
  lastEndereco: string,
  handleDialogOpen: () => void,
};

const LocalButton = ({ lastEndereco, handleDialogOpen }:LocalButtonProps) => (
  <>
    {lastEndereco && (
    <>
      <Grid item xs={12}>
        <Button
          startIcon={<LocationOnIcon />}
          size="small"
          variant="text"
          onClick={handleDialogOpen}
          color="primary"
          fullWidth
        >
          {lastEndereco}
        </Button>
      </Grid>
    </>
    )}
  </>
);

export default LocalButton;
