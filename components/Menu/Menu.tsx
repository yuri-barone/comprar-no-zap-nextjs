/* eslint-disable max-len */
import React from 'react';
import red from '@material-ui/core/colors/red';
import {
  Box,
  Dialog, Divider, Grid, IconButton, ListItemIcon, makeStyles, MenuItem, MenuList, Slide, Typography, withStyles,
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ListAltIcon from '@material-ui/icons/ListAlt';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

export type MenuProps = {
  session: any,
  xsMenu: boolean,
  handleXsMenuClose: () => void,
  lastEndereco: string,
  handleDialogOpen: () => void,
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
  redIcon: {
    color: red[500],
  },
}));

const DangerItem = withStyles({
  root: {
    color: red[500],
  },
})(MenuItem);

// eslint-disable-next-line react/display-name
const TransitionMenu = React.forwardRef((props: TransitionProps,
  ref: React.Ref<unknown>) => <Slide direction="left" ref={ref} {...props} />);

const Menu = ({
  xsMenu, handleXsMenuClose, session, lastEndereco, handleDialogOpen,
}:MenuProps) => {
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
            <MenuList>
              <MenuItem onClick={() => {
                window.location.href = '/cadastro';
              }}
              >
                <ListItemIcon>
                  <PersonAddIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <Typography align="center" color="primary">Cadastro</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                window.location.href = '/entrar';
              }}
              >
                <ListItemIcon>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <Typography align="center" color="primary">Entrar</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                window.location.href = '/';
              }}
              >
                <ListItemIcon>
                  <HomeIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <Typography align="center" color="primary">Página inicial</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                window.location.href = '/sobre';
              }}
              >
                <ListItemIcon>
                  <InfoOutlinedIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <Typography align="center" color="primary">Sobre</Typography>
              </MenuItem>
              {lastEndereco && (
              <MenuItem onClick={() => {
                handleDialogOpen();
                handleXsMenuClose();
              }}
              >
                <ListItemIcon>
                  <LocationOnIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <Typography align="center" color="primary">{lastEndereco}</Typography>
              </MenuItem>
              )}
            </MenuList>
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
                <MenuList>
                  <MenuItem onClick={() => {
                    window.location.href = '/editPerfil';
                  }}
                  >
                    <ListItemIcon>
                      <PersonAddIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <Typography align="center" color="primary">Editar meu perfil</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    window.location.href = '/produtos';
                  }}
                  >
                    <ListItemIcon>
                      <ShoppingCartIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <Typography align="center" color="primary">Meus produtos</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    window.location.href = `/lojas/${session.profile.domain}`;
                  }}
                  >
                    <ListItemIcon>
                      <MenuBookIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <Typography align="center" color="primary">Meu catálogo</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    window.location.href = '/meuspedidos';
                  }}
                  >
                    <ListItemIcon>
                      <ListAltIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <Typography align="center" color="primary">Meus pedidos</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    window.location.href = '/';
                  }}
                  >
                    <ListItemIcon>
                      <HomeIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <Typography align="center" color="primary">Página inicial</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    window.location.href = '/sobre';
                  }}
                  >
                    <ListItemIcon>
                      <InfoOutlinedIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <Typography align="center" color="primary">Sobre</Typography>
                  </MenuItem>
                  {lastEndereco && (
                  <MenuItem onClick={() => {
                    handleDialogOpen();
                    handleXsMenuClose();
                  }}
                  >
                    <ListItemIcon>
                      <LocationOnIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <Typography align="center" color="primary">{lastEndereco}</Typography>
                  </MenuItem>
                  )}
                  <DangerItem onClick={() => {
                    localStorage.removeItem('PDZT');
                    localStorage.removeItem('PDZU');
                    window.location.reload(true);
                  }}
                  >
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small" className={classes.redIcon} />
                    </ListItemIcon>
                    <Typography align="center">Sair</Typography>
                  </DangerItem>
                </MenuList>
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
