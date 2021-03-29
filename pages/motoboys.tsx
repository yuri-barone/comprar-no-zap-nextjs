/* eslint-disable max-len */
import {
  Box, Button, CircularProgress, Container, Dialog, Divider, Grid, Hidden, IconButton, makeStyles, Snackbar, TextField, Typography,
} from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { Alert } from '@material-ui/lab';
import MyAppBar from '../components/MyAppBar/MyAppBar';
import MyAppBarLogged from '../components/MyAppBar/MyAppBarLogged';
import Search from '../components/Search/Search';
import useSession from '../components/useSession';
import Menu from '../components/Menu/Menu';
import perfisService from '../components/services/perfisService';
import useCoordinate from '../components/useCoordinate';
import ImageFeedback from '../components/ImageFeedback/ImageFeedback';
import EnterpriseCard from '../components/EnterpriseCard/EnterpriseCard';
import useLikeActions from '../components/ProductCard/useLikeActions';

const useStyles = makeStyles((theme) => ({
  missingItems: {
    minHeight: 'calc(100vh - 136px)',
  },
  container: {
    paddingBottom: theme.spacing(6),
  },
  containerMarginFix4: {
    marginTop: theme.spacing(4),
  },
}));
const motoboys = () => {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const [termToFind, setTermToFind] = useState<string | undefined>(undefined);
  const [requiredDialog, setRequiredDialog] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [lastEndereco, setLastEndereco] = useState(undefined);
  const [xsMenu, setXsMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [motoboysData, setMotoboysData] = useState([]);
  const [alertGeocode, setAlertGeocode] = useState(false);
  const [endereco, setEndereco] = useState<string | undefined>('');

  const coordinates = useCoordinate();
  const session = useSession();
  const likeActions = useLikeActions();

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

  const getMotoboys = useCallback(async () => {
    try {
      const motoboyResponse = await perfisService.find(
        termToFind,
        JSON.parse(localStorage.getItem('ComprarNoZapLatLng')),
        true,
      );
      return motoboyResponse.data.data;
    } catch (error) {
      return [];
    }
  }, [termToFind, coordinates]);

  const loadMotoboys = async () => {
    const motoboysResponse = await getMotoboys();
    setMotoboysData(motoboysResponse);
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
    loadMotoboys();
  }, []);

  useEffect(() => {
    const executarBuscaTimeout = setTimeout(loadMotoboys, 500);
    return () => clearTimeout(executarBuscaTimeout);
  }, [searchInput, coordinates.loading,
    coordinates.position]);

  const searchOnChange = (e: any) => {
    setSearchInput(e.target.value);
  };

  const aplicarFiltrosAoEstado = (
    term: string | undefined,
  ) => {
    setTermToFind(term);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!requiredDialog) {
      setOpenDialog(false);
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

  const handleXsMenuOpen = () => {
    setXsMenu(true);
  };

  const handleXsMenuClose = () => {
    setXsMenu(false);
  };

  const setLatLong = async (latLng:any) => {
    const coordinatesToSave = { latitude: latLng.lat, longitude: latLng.lng };
    localStorage.setItem('ComprarNoZapLatLng', JSON.stringify(coordinatesToSave));
    coordinates.allowed = true;
    handleDialogClose();
    setIsLoading(true);
    const motoboysPerf = await getMotoboys();
    setMotoboysData(motoboysPerf);
    setIsLoading(false);
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

  const handleAddressSelect = (address:string) => {
    geocodeByAddress(address)
      .then((results:any) => {
        const completeAddress = results[0];
        const shortAddress = getShortAddress(completeAddress.address_components);
        localStorage.setItem('ComprarNoZapEnderecoCurto', shortAddress);
        setLastEndereco(shortAddress);
        return getLatLng(completeAddress);
      })
      .then((latLng:any) => setLatLong(latLng))
      .catch((error:Error) => error);
    setRequiredDialog(false);
    setOpenDialog(false);
  };

  const askGeolocation = () => {
    navigator.geolocation.getCurrentPosition(setGeolocation);
  };

  const changeEndereco = (selectedAddress:string) => {
    setEndereco(selectedAddress);
  };

  const handleToggleLikeStore = (storeId: number) => {
    let direction = 1;

    const newMotoboysData = motoboysData.map((local:any) => {
      if (local.id === storeId) {
        direction = local.liked ? -1 : 1;
        return { ...local, liked: direction > 0, likecount: local.likecount + direction };
      }
      return local;
    });

    setMotoboysData(newMotoboysData);

    if (direction > 0) {
      likeActions.likeStore(storeId);
    } else {
      likeActions.dislikeStore(storeId);
    }
  };

  return (
    <>
      <Hidden xsDown>
        {session.isAutheticated && (
        <MyAppBarLogged
          value={searchInput}
          onChange={searchOnChange}
          onSearch={aplicarFiltrosAoEstado}
          src={session.isAutheticated && session.profile['picture.imgBase64']}
          name={session.isAutheticated && session.profile.nome}
          zap={session.isAutheticated && session.profile.zap}
          domain={session.isAutheticated && session.profile.domain}
          seller={session.isAutheticated && session.profile.seller}
          lastEndereco={lastEndereco}
          handleDialogOpen={handleDialogOpen}
          likes={session.profile.likecount}
        />

        )}
        {!session.isAutheticated && (

        <MyAppBar
          value={searchInput}
          onChange={searchOnChange}
          onSearch={aplicarFiltrosAoEstado}
          handleDialogOpen={handleDialogOpen}
          lastEndereco={lastEndereco}
        />
        )}
      </Hidden>
      <Hidden smUp>
        <Grid container alignItems="center">
          <Grid item xs>
            <Box p={1}>
              <Search value={searchInput} onEnter={() => null} onChange={searchOnChange} />
            </Box>
          </Grid>
          <Grid item xs="auto">
            <IconButton color="primary" onClick={handleXsMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Hidden>
      <Divider id="back-to-top-anchor" />
      <Container className={classes.container}>
        {isLoading && (
        <Grid item xs={12} className={classes.missingItems}>
          <Grid container alignContent="center" className={classes.missingItems}>
            <Grid item xs={12}>
              <ImageFeedback
                image="/Mr-Bean-waiting.gif"
                message="Carregando..."
              />
            </Grid>
          </Grid>
        </Grid>
        )}
        {!isLoading && (
        <Grid container alignItems="stretch" spacing={4}>
          {motoboysData && motoboysData.map((item) => (
            <Grid item xs={12} md={12} sm={12} lg={6} key={item.id}>
              <EnterpriseCard
                id={item.id}
                name={item.nome}
                zap={item.zap}
                endereco={item.endereco}
                pictureId={item.pictureId}
                distance={item.distance}
                prefix={item.prefix}
                liked={item.liked}
                likecount={item.likecount}
                toggleLike={handleToggleLikeStore}
              />
            </Grid>
          ))}

          {motoboysData.length === 0 && !isLoading && (
          <Grid item xs={12} className={classes.containerMarginFix4}>
            <ImageFeedback
              image="/Jhon-Travolta.gif"
              message="Hmm... Nenhum motoboy foi encontrado nessa região."
            />
          </Grid>
          )}
        </Grid>
        )}
      </Container>
      <Dialog
        open={openDialog}
        keepMounted
        onClose={handleDialogClose}
      >
        <Box p={2}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs="auto">
              <Typography variant="h6">Qual a sua cidade</Typography>
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
        autoHideDuration={5000}
      >
        <Alert severity="error">
          Ocorreu um erro ao acessar a sua localização
        </Alert>
      </Snackbar>
    </>
  );
};

export default motoboys;
