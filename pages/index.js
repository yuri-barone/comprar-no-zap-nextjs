import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import LoggedBarIndex from '../components/LoggedBar/LoggedBarIndex';
import Search from '../components/Search/Search';
import useCoordinate from '../components/useCoordinate';
import useNavigation from '../components/useNavigation';
import useSession from '../components/useSession';

const useStyles = makeStyles((theme) => ({
  img: {
    objectFit: 'cover',
    width: '100%',
  },
  imgDiv: {
    padding: 20,
  },
  containerHeight: {
    height: '100%',
  },
  link: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  clickable: {
    cursor: 'pointer',
  },
}));

export default function Home() {
  const classes = useStyles();
  const Router = useRouter();
  const [filter, setFilter] = useState('');
  const session = useSession(false);
  const navigation = useNavigation();
  const coordinates = useCoordinate();

  const handleProductSearch = () => {
    const query = navigation.generateQueryUrl('1', filter);
    Router.push({
      pathname: '/search',
      query,
    });
  };
  const handlePlacesSearch = () => {
    const query = navigation.generateQueryUrl('0', filter);
    Router.push({
      pathname: '/search',
      query,
    });
  };

  const storeFilter = (e) => {
    setFilter(e.target.value);
  };

  const askGeolocation = () => {
    const success = () => { window.location.reload(); };
    navigator.geolocation.getCurrentPosition(success);
  };

  return (
    <>
      <Grid container className={classes.containerHeight} spacing={2}>
        <Grid item xs={12}>
          {session.isAutheticated && (
          <div>
            {!coordinates.allowed && (
            <Grid item xs={12}>
              <Alert severity="info">
                Buscando por todo o Brasil, para pesquisar pela sua cidade clique
                {' '}
                <Link onClick={askGeolocation} className={classes.clickable}>
                  <strong>aqui.</strong>
                </Link>
              </Alert>
            </Grid>
            )}
            <LoggedBarIndex
              src={session.profile['picture.imgBase64']}
              name={session.profile.nome}
              zap={session.profile.zap}
              domain={session.profile.domain}
              seller={session.profile.seller}
            />
          </div>
          )}
          {!session.isAutheticated && (

          <Grid container spacing={1}>
            {!coordinates.allowed && (
            <Grid item xs={12}>
              <Alert severity="info">
                Buscando por todo o Brasil, para pesquisar pela sua cidade clique
                {' '}
                <Link onClick={askGeolocation} className={classes.clickable}>
                  <strong>aqui.</strong>
                </Link>
              </Alert>
            </Grid>
            )}
            <Grid item xs />
            <Grid item xs="auto" sm="auto">
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
          )}
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
        <Container>
          <Grid item xs={12}>
            <Grid container spacing={2} justify="center">
              <Grid item xs={12} sm={6}>
                <img
                  alt=""
                  src="/comprar-no-zap.svg"
                  className={classes.img}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Search onEnter={handlePlacesSearch} onChange={storeFilter} />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={12} sm={4} md={4}>
                    <Button color="primary" type="submit" variant="contained" onClick={handlePlacesSearch} fullWidth size="large">
                      Ver lugares
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Button color="secondary" variant="outlined" onClick={handleProductSearch} fullWidth size="large">
                      Ver produtos
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography variant="body1" color="textSecondary" align="center">
                  Não perca tempo procurando, o
                  {' '}
                  <Box component="span" fontWeight="fontWeightBold">
                    Comprar no zap
                  </Box>
                  {' '}
                  já organizou tudo para você!
                </Typography>
                <Typography variant="body1" color="textSecondary" align="center">
                  Hambúrgueres, lanches, porções, eletrônicos, roupas...
                  {' '}
                  <Box component="span" fontWeight="fontWeightBold">
                    se tem zap está aqui!
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </>
  );
}
