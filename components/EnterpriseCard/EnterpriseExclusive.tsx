import {
  Avatar, Box, Button, Grid, Hidden, makeStyles, Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';

export type EnterpriseExclusiveProps = {
  perfil: any;
  isTheSamePerf: boolean;
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

const EnterpriseExclusive = ({ perfil, isTheSamePerf }:EnterpriseExclusiveProps) => {
  const classes = useStyles();
  const router = useRouter();

  const sendMessage = () => {
    const link = `https://api.whatsapp.com/send?phone=55${perfil.zap}&text=Ol%C3%A1,%20te%20encontrei%20no%20*comprarnozap.com*`;
    const win = window.open(link, '_blank');
    win.focus();
  };

  const goToProdutos = () => {
    router.push('/produtos');
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
          <Grid container spacing={1}>
            {isTheSamePerf && (
            <Grid item xs={12}>
              <Button variant="outlined" color="inherit" onClick={goToProdutos} fullWidth>Cadastrar meus produtos</Button>
            </Grid>
            )}
            <Grid item xs={12}>
              <Button variant="contained" color="default" onClick={sendMessage} fullWidth>Entrar em contato</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EnterpriseExclusive;
