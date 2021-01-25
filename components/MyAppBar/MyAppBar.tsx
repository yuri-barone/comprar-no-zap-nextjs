import {
  Box,
  Container,
  Grid,
  Hidden,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import LocalButtonAdornment from '../LocalButton/LocalButtonAdornment';
import Search from '../Search/Search';
import MyAppBarSm from './MyAppBarSm';

export type MyAppBarProps = {
  onSearch: (filter:string) => void,
  searchDefaultValue?: string,
  value?: string,
  onChange: (filter:string) => void,
  handleDialogOpen: () => void,
  lastEndereco: string,
};

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
  },
  link: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const MyAppBar = ({
  value, onChange, onSearch, lastEndereco, handleDialogOpen,
}: MyAppBarProps) => {
  const classes = useStyles();
  return (
    <>
      <Hidden xsDown>
        <div className={classes.root}>
          <Container>
            <Box p={2}>
              <Grid container alignItems="center">
                <Grid item xs={3} sm="auto">
                  <div className={classes.imgDiv}>
                    <a href="/">
                      <img
                        alt=""
                        src="/comprar-no-zap-logo.svg"
                        className={classes.img}
                        height="100%"
                        width="100%"
                      />
                    </a>
                  </div>
                </Grid>
                <Grid item xs={9} sm={6}>
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
                <Grid item xs>
                  <Grid container>
                    <Grid item xs />
                    <Grid item xs="auto">
                      <Box pt={2} pl={2} pr={2} pb={1}>
                        <Typography className={classes.link}>
                          <Link href="/cadastro" color="inherit">
                            Cadastro
                          </Link>
                          <Link href="/entrar" color="inherit">
                            Login
                          </Link>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </div>
      </Hidden>
      <Hidden smUp>
        <MyAppBarSm
          value={value}
          onChange={onChange}
          onSearch={onSearch}
          lastEndereco={lastEndereco}
          handleDialogOpen={handleDialogOpen}
        />
      </Hidden>
    </>
  );
};

export default MyAppBar;
