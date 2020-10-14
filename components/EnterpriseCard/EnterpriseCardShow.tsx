import {
  Avatar,
  Button,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';

export type EnterpriseCardProps = {
  src?: string;
  name?: string;
  zap?: string;
  endereco?: string;
  id?: number;
  onRemove?: () => void;
};

const useStyles = makeStyles((theme) => ({
  root: {},
  avatarSize: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  maxHeigth: {
    height: '100%',
  },
}));
const EnterpriseCard = ({
  src, name, endereco, onRemove,
}: EnterpriseCardProps) => {
  const classes = useStyles();
  return (
    <Grid container alignItems="center">
      <Grid item xs={2}>
        <Avatar src={src} className={classes.avatarSize} />
      </Grid>
      <Grid item xs={6}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">{name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary">{endereco}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="outlined" color="primary" fullWidth onClick={onRemove}>
              Continuar procurando
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EnterpriseCard;
