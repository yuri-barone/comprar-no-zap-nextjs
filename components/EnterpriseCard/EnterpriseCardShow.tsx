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
  onTalk?: () => void;
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
  hideName: {
    maxWidth: theme.spacing(10),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: 'black',
  },
}));
const EnterpriseCard = ({
  src, name, endereco, onRemove, onTalk,
}: EnterpriseCardProps) => {
  const classes = useStyles();
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item xs="auto">
        <Avatar src={src} className={classes.avatarSize} />
      </Grid>
      <Grid item xs>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">{name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary">{endereco}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={onTalk}>
              Falar com o estabelecimento
            </Button>
          </Grid>
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
