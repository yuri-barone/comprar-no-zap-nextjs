import {
  Avatar, Box, Button, Grid, Hidden, makeStyles, Typography,
} from '@material-ui/core';
import React from 'react';

export type EnterpriseExclusiveProps = {
  perfil: any;
};

const useStyles = makeStyles((theme) => ({
  avatarSize: {
    width: theme.spacing(13),
    height: theme.spacing(13),
  },
  textColor: {
    color: theme.palette.common.white,
  },
}));

const EnterpriseExclusive = ({ perfil }:EnterpriseExclusiveProps) => {
  const classes = useStyles();

  const sendMessage = () => {
    const link = `https://api.whatsapp.com/send?phone=55${perfil.zap}&text=Ol%C3%A1,%20te%20encontrei%20no%20*comprarnozap.com*`;
    const win = window.open(link, '_blank');
    win.focus();
  };
  return (
    <>
      <Grid container alignItems="center" spacing={2} justify="center">
        <Grid item xs="auto">
          <Avatar src={perfil['picture.imgBase64']} className={classes.avatarSize} />
        </Grid>
        <Grid item xs={12} md={7} sm={12}>
          <Grid container justify="center">
            <Grid item xs="auto" md={12} lg={12}>
              <Hidden smDown>
                <Typography variant="h4" className={classes.textColor}>
                  <Box fontWeight="fontWeightBold">
                    {perfil.nome}
                  </Box>
                </Typography>
                <Typography className={classes.textColor}>
                  {perfil.endereco}
                </Typography>
              </Hidden>
              <Hidden mdUp>
                <Typography variant="h4" className={classes.textColor} align="center">
                  <Box fontWeight="fontWeightBold">
                    {perfil.nome}
                  </Box>
                </Typography>
                <Typography className={classes.textColor} align="center">
                  {perfil.endereco}
                </Typography>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs="auto" md={3}>
          <Button variant="contained" color="default" onClick={sendMessage}>Entrar em contato</Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EnterpriseExclusive;
