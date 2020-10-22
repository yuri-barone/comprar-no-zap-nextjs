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
import Search from '../Search/Search';
import MyAppBarSm from './MyAppBarSm';

export type MyAppBarProps = {
  onSearch: (filter:string) => void,
  searchDefaultValue?: string,
  value?: string,
  onChange: (filter:string) => void,
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

const MyAppBar = ({ value, onChange, onSearch }: MyAppBarProps) => {
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
                    <img
                      alt=""
                      src="/comprar-no-zap-logo.svg"
                      className={classes.img}
                      height="100%"
                      width="100%"
                    />
                  </div>
                </Grid>
                <Grid item xs={9} sm={6}>
                  <Search value={value} onEnter={() => null} onChange={onChange} />
                </Grid>
                <Grid item xs />
                <Grid item xs="auto">
                  <Box p={2}>
                    <Typography className={classes.link}>
                      <Link href="/cadastro" color="inherit">
                        Cadastrar-me
                      </Link>
                      <Link href="/entrar" color="inherit">
                        Logar-me
                      </Link>
                    </Typography>
                  </Box>
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
        />
      </Hidden>
    </>
  );
};

export default MyAppBar;
