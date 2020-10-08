import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  makeStyles,
  Popover,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import Search from "../Search/Search";

export type MyAppBarProps = {
  onSearch: (filter: string) => void;
  searchDefaultValue?: string;
  value?: string;
  onChange: (filter: string) => void;
  src?: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#fff",
    width: "100%",
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
    objectFit: "cover",
  },
  link: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  imgPopover: {
    objectFit: "cover",
    width: theme.spacing(20),
    heigth: theme.spacing(20),
  },
  avatarClick: {
    cursor: "pointer",
  },
}));

const MyAppBar = ({ value, onChange, src }: MyAppBarProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className={classes.root}>
      <Container>
        <Box p={2}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs="auto">
              <div className={classes.imgDiv}>
                <img
                  alt=""
                  src="/comprar-no-zap-logo.svg"
                  className={classes.img}
                  height="100%"
                  width="100%"
                ></img>
              </div>
            </Grid>
            <Grid item xs={6}>
              <Search
                value={value}
                onEnter={() => null}
                onChange={onChange}
              ></Search>
            </Grid>
            <Grid item xs></Grid>
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
                src={src}
                className={classes.avatarClick}
              ></Avatar>
              <Popover
                id="showProfile"
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <img alt="" src={src} className={classes.imgPopover} />
                <Typography className={classes.link} variant="h6" align="center" color="primary">
                  <Link href="/editPerfil" color="inherit">
                    Editar perfil
                  </Link>
                </Typography>
              </Popover>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default MyAppBar;
