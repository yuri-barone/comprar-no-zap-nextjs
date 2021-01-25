import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Search from '../Search/Search';

export type MyAppBarSmProps = {
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

const MyAppBarSm = ({
  value, onChange, lastEndereco, handleDialogOpen,
}: MyAppBarSmProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container>
        <Grid item xs={12}>
          <Box p={2}>
            <Typography className={classes.link} align="center">
              <Link href="/cadastro" color="inherit">
                Cadastro
              </Link>
              <Link href="/entrar" color="inherit">
                Login
              </Link>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box pb={2}>
            <Button
              startIcon={<LocationOnIcon />}
              size="small"
              variant="text"
              onClick={handleDialogOpen}
              color="primary"
              fullWidth
            >
              {lastEndereco}
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Search value={value} onEnter={() => null} onChange={onChange} />
        </Grid>
      </Container>
    </div>
  );
};

export default MyAppBarSm;
