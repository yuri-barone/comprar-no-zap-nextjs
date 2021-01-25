/* eslint-disable max-len */
import React from 'react';
import red from '@material-ui/core/colors/red';
import {
    Box,
  Button, Dialog, Divider, Grid, IconButton, makeStyles, Slide, Typography, withStyles,
} from '@material-ui/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';

export type MenuProps = {
  session: any,
  xsMenu: boolean,
  handleXsMenuClose: () => void,
};

const useStyles = makeStyles((theme) => ({
  imgAvatar: {
    objectFit: 'cover',
    borderRadius: 200,
  },
  imgPopover: {
    display: 'flex',
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const ColorButton = withStyles({
  root: {
    color: red[500],
  },
})(Button);

// eslint-disable-next-line react/display-name
const TransitionMenu = React.forwardRef((props: TransitionProps,
  ref: React.Ref<unknown>) => <Slide direction="left" ref={ref} {...props} />);

const Menu = ({ xsMenu, handleXsMenuClose, session }:MenuProps) => {
  const classes = useStyles();
  return (
    <Dialog fullScreen open={xsMenu} onClose={handleXsMenuClose} TransitionComponent={TransitionMenu}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="flex-end">
            <Grid item xs="auto">
              <IconButton color="primary" onClick={handleXsMenuClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {!session.isAutheticated && (
        <>
          <Grid item xs={12}>
            <Button color="primary" size="large" fullWidth href="/cadastro">
              Cadastrar-me
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" size="large" fullWidth href="/entrar">
              Logar-me
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" size="large" fullWidth href="/">
              Página Inicial
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </>
        )}
        {session.isAutheticated && (
        <>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item xs={12}>
                <Grid container justify="center">
                  <Grid item xs="auto">
                    <Box p={1}>
                      <div className={classes.imgPopover}>
                        <img
                          src={session.profile['picture.imgBase64'] || '/empty-profile.png'}
                          alt=""
                          className={classes.imgAvatar}
                          height="100%"
                          width="100%"
                        />
                      </div>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography align="center" gutterBottom variant="h6">
                      {session.profile.nome}
                    </Typography>
                    <Typography
                      align="center"
                      gutterBottom
                      color="textSecondary"
                    >
                      {session.profile.zap}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth size="large" color="primary" href="/editPerfil">
                  Editar meu perfil
                </Button>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth size="large" color="primary" href="/produtos">
                  Meus produtos
                </Button>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth size="large" color="primary" href={`/lojas/${session.profile.domain}`}>
                  Meu catálogo
                </Button>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth size="large" color="primary" href="/">
                  Página inicial
                </Button>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <ColorButton
                  fullWidth
                  size="large"
                  onClick={() => {
                    localStorage.removeItem('PDZT');
                    localStorage.removeItem('PDZU');
                    window.location.reload(true);
                  }}
                >
                  Sair
                </ColorButton>
                <Divider />
              </Grid>
            </Grid>
          </Grid>
        </>
        )}
      </Grid>
    </Dialog>
  );
};

export default Menu;
