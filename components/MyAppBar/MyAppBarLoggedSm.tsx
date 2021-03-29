import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Popover,
  Typography,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import red from '@material-ui/core/colors/red';
import { useRouter } from 'next/router';
import Search from '../Search/Search';
import LocalButton from '../LocalButton/LocalButton';
import Clap from '../icons/Clap';

export type MyAppBarLoggedSmProps = {
  onSearch: (filter: string) => void;
  searchDefaultValue?: string;
  value?: string;
  onChange: (filter: string) => void;
  src?: string;
  name: string;
  zap: string;
  seller: boolean;
  domain: string;
  lastEndereco: string;
  likes: number,
  handleDialogOpen: () => void;
};

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  title: {},
  imgDiv: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 10,
    width: 40,
  },
  img: {
    objectFit: 'cover',
    borderRadius: 200,
  },
  logo: {
    objectFit: 'cover',
  },
  link: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  imgPopover: {
    display: 'flex',
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  avatarClick: {
    cursor: 'pointer',
  },
  sizePopover: {
    width: 300,
  },
  iconColor: {
    color: theme.palette.primary.main,
  },
}));

const MyAppBarLoggedSm = ({
  value, onChange, src, name, zap, seller, domain, handleDialogOpen, lastEndereco, likes,
}: MyAppBarLoggedSmProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const Router = useRouter();
  const handleOnClick = () => {
    localStorage.removeItem('PDZT');
    localStorage.removeItem('PDZU');
    Router.push('/');
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const showCatalogo = () => {
    const link = `/lojas/${domain}`;
    const win = window.open(link, '_blank');
    win.focus();
  };

  return (
    <div className={classes.root}>
      <Container>
        <Box p={1}>
          <Grid container alignItems="center" spacing={2}>
            <LocalButton lastEndereco={lastEndereco} handleDialogOpen={handleDialogOpen} />
            <Grid item xs={10}>
              <Search
                value={value}
                onEnter={() => null}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={2}>
              <Avatar
                onClick={handleClick}
                src={src || '/empty-profile.png'}
                className={classes.avatarClick}
              />
              <Popover
                id="showProfile"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box p={2} className={classes.sizePopover}>
                  <Grid container justify="center" spacing={2}>
                    <Grid item xs="auto">
                      <div className={classes.imgPopover}>
                        <img
                          src={src || '/empty-profile.png'}
                          alt=""
                          className={classes.img}
                          height="100%"
                          width="100%"
                        />
                      </div>
                    </Grid>
                    {!!likes && (
                    <Grid item xs={12}>
                      <Grid container justify="center" spacing={2}>
                        <Grid item xs="auto">
                          <div className={classes.iconColor}>
                            <Clap />
                          </div>
                        </Grid>
                        <Grid item xs="auto">
                          <Typography color="primary">
                            {likes}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    )}
                    <Grid item xs={12}>
                      <Typography align="center" gutterBottom variant="h6">
                        {name}
                      </Typography>
                      <Typography
                        align="center"
                        gutterBottom
                        color="textSecondary"
                      >
                        {zap}
                      </Typography>
                      <Button
                        href="/editPerfil"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                      >
                        Editar meu perfil
                      </Button>
                    </Grid>
                    {seller && (
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={showCatalogo}
                        fullWidth
                      >
                        Meu catálogo
                      </Button>
                    </Grid>
                    )}
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        href="/meuspedidos"
                      >
                        Meus pedidos
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        href="/motoboys"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                      >
                        Contratar Motoboy
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <ColorButton
                        variant="outlined"
                        fullWidth
                        onClick={handleOnClick}
                      >
                        Sair
                      </ColorButton>
                    </Grid>
                  </Grid>
                </Box>
              </Popover>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default MyAppBarLoggedSm;
