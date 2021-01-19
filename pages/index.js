/* eslint-disable react/display-name */
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  Link,
  makeStyles,
  Slide,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LoggedBarIndex from '../components/LoggedBar/LoggedBarIndex';
import Search from '../components/Search/Search';
import useCoordinate from '../components/useCoordinate';
import useNavigation from '../components/useNavigation';
import useSession from '../components/useSession';
import LocalButton from '../components/LocalButton/LocalButton';

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
      cursor: 'pointer',
    },
  },
  clickable: {
    cursor: 'pointer',
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function Home() {
  const classes = useStyles();
  const Router = useRouter();
  const [filter, setFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [endereco, setEndereco] = useState('');
  const [lastEndereco, setLastEndereco] = useState(undefined);
  const [requiredDialog, setRequiredDialog] = useState(true);
  const session = useSession(false);
  const navigation = useNavigation();
  const coordinates = useCoordinate;

  useEffect(() => {
    setLastEndereco(localStorage.getItem('ComprarNoZapEndereco'));
    if (localStorage.getItem('ComprarNoZapEndereco')) {
      setRequiredDialog(false);
    }
  }, []);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!requiredDialog) {
      setOpenDialog(false);
    }
  };

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
    navigator.geolocation.getCurrentPosition(handleDialogClose);
    coordinates.allowed = true;
  };

  const setLatLong = (latLng, Address) => {
    const coordinatesToSave = { latitude: latLng.lat, longitude: latLng.lng };
    localStorage.setItem('ComprarNoZapLatLng', JSON.stringify(coordinatesToSave));
    localStorage.setItem('ComprarNoZapEndereco', Address);
    coordinates.allowed = true;
    handleDialogClose();
  };

  const handleAddressSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => setLatLong(latLng, address))
      .catch((error) => error);
    setLastEndereco(address);
    setRequiredDialog(false);
    setOpenDialog(false);
  };

  const changeEndereco = (selectedAddress) => {
    setEndereco(selectedAddress);
  };

  return (
    <>
      <Grid container className={classes.containerHeight} spacing={2}>
        <Grid item xs={12}>
          {session.isAutheticated && (
          <div>
            {!coordinates.allowed && !lastEndereco && (
            <Grid item xs={12}>
              <Alert severity="info">
                Buscando por todo o Mundo, para pesquisar pela sua cidade clique
                {' '}
                <Link onClick={handleDialogOpen} className={classes.clickable}>
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
              lastEndereco={lastEndereco}
              handleDialogOpen={handleDialogOpen}
            />
          </div>
          )}
          {!session.isAutheticated && (

          <Grid container spacing={1}>
            {!coordinates.allowed && !lastEndereco && (
            <Grid item xs={12}>
              <Alert severity="info">
                Buscando por todo o Mundo, para pesquisar pela sua cidade clique
                {' '}
                <Link onClick={handleDialogOpen} className={classes.clickable}>
                  <strong>aqui.</strong>
                </Link>
              </Alert>
            </Grid>
            )}
            {lastEndereco && (
            <Grid item xs={12} sm={12} md={6} lg={5}>
              <Box p={2}>
                <Grid container>
                  <LocalButton lastEndereco={lastEndereco} handleDialogOpen={handleDialogOpen} />
                </Grid>
              </Box>
            </Grid>
            )}
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
          <Dialog
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDialogClose}
          >
            <Box p={2}>
              <Grid container justify="center" spacing={2}>
                <Grid item xs="auto">
                  <Typography variant="h6">Onde quer receber seu pedido?</Typography>
                </Grid>
                <Grid item xs={12}>
                  <PlacesAutocomplete
                    value={endereco}
                    onChange={(address) => { changeEndereco(address); }}
                    onSelect={(address) => {
                      handleAddressSelect(address);
                      changeEndereco(address);
                    }}
                  >
                    {({
                      getInputProps, suggestions, getSuggestionItemProps, loading,
                    }) => (
                      <div>
                        <TextField
                          {...getInputProps({
                            placeholder: 'Endereço',
                          })}
                          variant="outlined"
                          value={endereco}
                          fullWidth
                          id="endereco"
                          label="Endereço"
                          InputProps={{
                            endAdornment: (
                              <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              </>
                            ),
                          }}
                        />
                        <div className="autocomplete-dropdown-container">
                          {suggestions.map((suggestion) => {
                            const className = suggestion.active
                              ? 'suggestion-item--active'
                              : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? { backgroundColor: '#bdbdbd', cursor: 'pointer' }
                              : { backgroundColor: '#e0e0e0', cursor: 'pointer' };
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <Box p={2}>
                                  <Typography>{suggestion.description}</Typography>
                                </Box>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={askGeolocation}
                    startIcon={<LocationOnIcon />}
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                  >
                    Usar minha localização
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Dialog>
        </Container>
      </Grid>
    </>
  );
}
