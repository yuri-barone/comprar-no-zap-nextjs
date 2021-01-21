/* eslint-disable max-len */
import {
  Avatar, Box, Button, Grid, Hidden, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React from 'react';

export type EnterpriseExclusiveProps = {
  perfil: any;
  isTheSamePerfil: boolean;
  whiteText?: boolean;
};

const useStyles = makeStyles((theme) => ({
  avatarSize: {
    width: theme.spacing(13),
    height: theme.spacing(13),
  },
  textColorWhite: {
    color: theme.palette.common.white,
  },
  textColorBlack: {
    color: theme.palette.common.black,
  },
}));

const EnterpriseExclusive = ({ perfil, isTheSamePerfil, whiteText }:EnterpriseExclusiveProps) => {
  const classes = useStyles();
  const router = useRouter();

  const sendMessage = () => {
    const link = `https://api.whatsapp.com/send?phone=${perfil.prefix}${perfil.zap}&text=Ol%C3%A1,%20te%20encontrei%20no%20*comprarnozap.com*`;
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
                <Typography variant="h4" className={clsx(whiteText ? classes.textColorWhite : classes.textColorBlack)}>
                  <Box fontWeight="fontWeightBold">
                    {perfil.nome}
                  </Box>
                </Typography>
                <Typography className={clsx(whiteText ? classes.textColorWhite : classes.textColorBlack)}>
                  {perfil.endereco}
                </Typography>
              </Hidden>
              <Hidden mdUp>
                <Typography variant="h4" className={clsx(whiteText ? classes.textColorWhite : classes.textColorBlack)} align="center">
                  <Box fontWeight="fontWeightBold">
                    {perfil.nome}
                  </Box>
                </Typography>
                <Typography className={clsx(whiteText ? classes.textColorWhite : classes.textColorBlack)} align="center">
                  {perfil.endereco}
                </Typography>
              </Hidden>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs="auto" md={3}>
          <Grid container spacing={1}>
            {isTheSamePerfil && (
            <Grid item xs={12}>
              <Button variant="contained" color="inherit" onClick={goToProdutos} fullWidth>Cadastrar meus produtos</Button>
            </Grid>
            )}
            {!isTheSamePerfil && (
            <Grid item xs={12}>
              <Button variant="contained" color="default" onClick={sendMessage} fullWidth>Entrar em contato</Button>
            </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EnterpriseExclusive;
