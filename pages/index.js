/* eslint-disable max-len */
/* eslint-disable react/display-name */
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
import StorefrontIcon from '@material-ui/icons/Storefront';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
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
    minHeight: '100vh',
  },
  link: {
    textAlign: 'end',
    '& > * + *': {
      marginLeft: theme.spacing(2),
      cursor: 'pointer',
    },
    [theme.breakpoints.only('xs')]: {
      textAlign: 'center',
    },
  },
  clickable: {
    cursor: 'pointer',
  },
  dialogWrapper: {
    overflowY: 'auto',
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
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [alertGeocode, setAlertGeocode] = useState(false);
  const session = useSession(false);
  const navigation = useNavigation();
  const coordinates = useCoordinate;

  const handleDangerClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertGeocode(false);
  };

  const checkIsBlocked = async () => {
    const asd = await navigator.permissions.query({ name: 'geolocation' });
    if (asd.state === 'prompt') {
      setLocationBlocked(false);
    }
    if (asd.state === 'granted') {
      setLocationBlocked(false);
    }
    if (asd.state === 'denied') {
      setLocationBlocked(true);
    }
  };

  useEffect(() => {
    setLastEndereco(localStorage.getItem('ComprarNoZapEnderecoCurto'));
    if (localStorage.getItem('ComprarNoZapEnderecoCurto')) {
      setRequiredDialog(false);
    }
    if (!localStorage.getItem('ComprarNoZapEnderecoCurto')) {
      setOpenDialog(true);
    }
    checkIsBlocked();
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

  const setLatLong = (latLng) => {
    const coordinatesToSave = { latitude: latLng.lat, longitude: latLng.lng };
    localStorage.setItem('ComprarNoZapLatLng', JSON.stringify(coordinatesToSave));
    coordinates.allowed = true;
    handleDialogClose();
  };

  const getLevelAddress = (addressParts, levelDescription) => addressParts.find((addressPart) => addressPart.types.includes(levelDescription));

  const getShortAddress = (addressComponents) => {
    const level1 = getLevelAddress(addressComponents, 'administrative_area_level_1');
    const level2 = getLevelAddress(addressComponents, 'administrative_area_level_2');
    const levelDescriptions = [];
    if (level2) {
      levelDescriptions.push(level2.short_name);
    }
    if (level1) {
      levelDescriptions.push(level1.short_name);
    }
    return levelDescriptions.join(' - ');
  };

  const setGeolocation = ({ coords }) => {
    const coordinatesToSave = { lat: coords.latitude, lng: coords.longitude };
    localStorage.setItem('ComprarNoZapLatLng', JSON.stringify(coordinatesToSave));
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=AIzaSyBb0OaO_k7YhPyJkn60P90Gw5tCi4EGGsg`).then((response) => response.json()).then((data) => {
      const shortAddress = getShortAddress(data.results[0].address_components);
      setLatLong(coordinatesToSave);
      localStorage.setItem('ComprarNoZapEnderecoCurto', shortAddress);
      setLastEndereco(shortAddress);
      setOpenDialog(false);
      coordinates.allowed = true;
    }).catch(() => {
      setAlertGeocode(true);
      setOpenDialog(true);
      coordinates.allowed = false;
    });
  };

  const askGeolocation = () => {
    navigator.geolocation.getCurrentPosition(setGeolocation);
  };

  const handleAddressSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        const completeAddress = results[0];
        const shortAddress = getShortAddress(completeAddress.address_components);
        const superCompleteAddress = results[0].formatted_address;
        localStorage.setItem('ComprarNoZapEndereco', superCompleteAddress);
        localStorage.setItem('ComprarNoZapEnderecoCurto', shortAddress);
        setLastEndereco(shortAddress);
        return getLatLng(completeAddress);
      })
      .then((latLng) => setLatLong(latLng))
      .catch((error) => error);
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
            {lastEndereco && (
            <Grid item xs={12} sm={6} lg={5}>
              <Box p={1}>
                <Grid container>
                  <LocalButton lastEndereco={lastEndereco} handleDialogOpen={handleDialogOpen} />
                </Grid>
              </Box>
            </Grid>
            )}
            <Grid item xs={12} sm={6} lg={7}>
              <Box p={1}>
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
          <Box p={2}>
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
                    <Grid item xs={12} sm={4} md={3}>
                      <Button startIcon={<StorefrontIcon />} color="primary" type="submit" variant="contained" onClick={handlePlacesSearch} fullWidth size="large">
                        Ver lugares
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                      <Button startIcon={<LocalMallOutlinedIcon />} color="secondary" variant="outlined" onClick={handleProductSearch} fullWidth size="large">
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
                      onSelect={(address, placeID) => {
                        handleAddressSelect(address, placeID);
                        changeEndereco(address, placeID);
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
                            label="Endereço para entrega"
                            InputProps={{
                              endAdornment: (
                                <>
                                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {endereco.length > 3 ? (
                                    <IconButton
                                      color="primary"
                                      aria-label="clear address"
                                      component="span"
                                      onClick={() => { setEndereco(''); }}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  ) : null}
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
                  {!locationBlocked && (
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
                  )}
                </Grid>
              </Box>
            </Dialog>
          </Box>
        </Container>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={alertGeocode}
          autoHideDuration={6000}
          onClose={handleDangerClose}
        >
          <Alert severity="error">
            Ocorreu um erro ao acessar a sua localização
          </Alert>
        </Snackbar>
      </Grid>
    </>
  );
}
