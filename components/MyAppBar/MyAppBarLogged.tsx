import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Hidden,
  Link,
  makeStyles,
  Popover,
  Typography,
  withStyles,
} from '@material-ui/core';
import React from 'react';
import red from '@material-ui/core/colors/red';
import { useRouter } from 'next/router';
import Search from '../Search/Search';
import MyAppBarLoggedSm from './MyAppBarLoggedSm';
import LocalButtonAdornment from '../LocalButton/LocalButtonAdornment';

export type MyAppBarLoggedProps = {
  onSearch: (filter: string) => void;
  searchDefaultValue?: string;
  value?: string;
  onChange: (filter: string) => void;
  src?: string;
  name: string;
  zap: string;
  domain: string;
  seller: boolean;
  handleDialogOpen: () => void;
  lastEndereco: string;
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
  clickable: {
    cursor: 'pointer',
  },
}));

const MyAppBarLogged = ({
  value,
  onChange,
  src,
  name,
  zap,
  onSearch,
  domain,
  seller,
  lastEndereco,
  handleDialogOpen,
}: MyAppBarLoggedProps) => {
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
    <>
      <Hidden xsDown>
        <div className={classes.root}>
          <Container>
            <Box p={2}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs="auto">
                  <div className={classes.imgDiv}>
                    <a href="/">
                      <img
                        alt=""
                        src="/comprar-no-zap-logo.svg"
                        className={classes.logo}
                        height="100%"
                        width="100%"
                      />
                    </a>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Search
                    value={value}
                    onEnter={() => null}
                    onChange={onChange}
                    InputAddornment={(
                      <LocalButtonAdornment
                        lastEndereco={lastEndereco}
                        handleDialogOpen={handleDialogOpen}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs />
                <Grid item xs="auto">
                  <Typography className={classes.link} component="span">
                    <Link href="/produtos" color="inherit">
                      Meus produtos
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs="auto">
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
                    <Box p={2}>
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
      </Hidden>
      <Hidden smUp>
        <MyAppBarLoggedSm
          value={value}
          onChange={onChange}
          onSearch={onSearch}
          src={src}
          name={name}
          zap={zap}
          seller={seller}
          domain={domain}
          lastEndereco={lastEndereco}
          handleDialogOpen={handleDialogOpen}
        />
      </Hidden>
    </>
  );
};

export default MyAppBarLogged;
