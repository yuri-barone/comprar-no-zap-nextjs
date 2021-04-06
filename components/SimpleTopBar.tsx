/* eslint-disable max-len */
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Link,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Alert } from '@material-ui/lab';
import LocalButton from './LocalButton/LocalButton';
import LoggedBarIndex from './LoggedBar/LoggedBarIndex';
import useSession from './useSession';
import useCoordinate from './useCoordinate';
import Menu from './Menu/Menu';

type SimpleTopBarProps = {
  requiredLogin: boolean,
};

const searchOptions = {
  componentRestrictions: { country: ['br'] },
};

const useStyles = makeStyles((theme) => ({
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
}));

const SimpleTopBar = ({ requiredLogin }:SimpleTopBarProps) => {
  const classes = useStyles();

  const [lastEndereco, setLastEndereco] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [requiredDialog, setRequiredDialog] = useState(true);
  const [xsMenu, setXsMenu] = useState(false);
  const [endereco, setEndereco] = useState('');
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [alertGeocode, setAlertGeocode] = useState(false);

  const session = useSession(requiredLogin);
  const coordinates = useCoordinate();

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!requiredDialog) {
      setOpenDialog(false);
    }
  };

  const handleXsMenuOpen = () => {
    setXsMenu(true);
  };

  const handleXsMenuClose = () => {
    setXsMenu(false);
  };

  const handleDangerClose = (event:any, reason:any) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertGeocode(false);
  };

  const setLatLong = async (latLng:any) => {
    const coordinatesToSave = { latitude: latLng.lat, longitude: latLng.lng };
    localStorage.setItem('ComprarNoZapLatLng', JSON.stringify(coordinatesToSave));
    coordinates.allowed = true;
    handleDialogClose();
  };

  const getLevelAddress = (addressParts:any, levelDescription:any) => addressParts.find((addressPart:any) => addressPart.types.includes(levelDescription));

  const getShortAddress = (addressComponents:any) => {
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

  const setGeolocation = ({ coords }:any) => {
    const coordinatesToSave = { lat: coords.latitude, lng: coords.longitude };
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

  const checkIsAllowed = async () => {
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
    checkIsAllowed();
  }, []);

  const handleAddressSelect = (address:string) => {
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

  const changeEndereco = (selectedAddress:string) => {
    setEndereco(selectedAddress);
  };

  return (
    <>
      <Hidden xsDown>
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
              likes={session.profile.likecount}
              deliverman={session.profile.deliverman}
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
                    Cadastro
                  </Link>
                  <Link href="/entrar" color="inherit">
                    Login
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
      </Hidden>
      <Hidden smUp>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs>
              <Box p={1}>
                <LocalButton lastEndereco={lastEndereco} handleDialogOpen={handleDialogOpen} />
              </Box>
            </Grid>
            <Grid item xs="auto">
              <IconButton color="primary" onClick={handleXsMenuOpen}>
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        </Grid>
      </Hidden>
      <Dialog
        open={openDialog}
        keepMounted
        onClose={handleDialogClose}
      >
        <Box p={2}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs="auto">
              <Typography variant="h6">Qual a sua cidade?</Typography>
            </Grid>
            <Grid item xs={12}>
              <PlacesAutocomplete
                value={endereco}
                onChange={(address) => { changeEndereco(address); }}
                onSelect={(address) => {
                  handleAddressSelect(address);
                  changeEndereco(address);
                }}
                searchOptions={searchOptions}
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
                      label="Cidade"
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
      <Menu
        session={session}
        handleXsMenuClose={handleXsMenuClose}
        xsMenu={xsMenu}
        lastEndereco={lastEndereco}
        handleDialogOpen={handleDialogOpen}
      />
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
    </>
  );
};

export default SimpleTopBar;
