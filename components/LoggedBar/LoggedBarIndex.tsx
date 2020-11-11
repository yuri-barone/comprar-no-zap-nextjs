import {
  Avatar,
  Box,
  Button,
  Grid,
  Link,
  makeStyles,
  Popover,
  Typography,
  withStyles,
} from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import React from 'react';

export type LoggedBarIndexProps = {
  src: string;
  name: string;
  zap: string;
  domain: string;
  seller: boolean;
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
  img: {
    objectFit: 'cover',
    borderRadius: 200,
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

const LoggedBarIndex = ({
  src, name, zap, domain, seller,
}:LoggedBarIndexProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOnClick = () => {
    localStorage.clear();
    window.location.reload(true);
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showCatalogo = () => {
    const link = `/lojas/${domain}`;
    const win = window.open(link, '_blank');
    win.focus();
  };

  const open = Boolean(anchorEl);
  return (
    <Box p={2}>
      <Grid container alignItems="center" spacing={2}>
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
  );
};

export default LoggedBarIndex;
