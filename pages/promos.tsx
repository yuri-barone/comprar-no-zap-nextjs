/* eslint-disable max-len */
/* eslint-disable react/display-name */
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Link,
  makeStyles,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { Alert } from '@material-ui/lab';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransitionProps } from '@material-ui/core/transitions';
import LoggedBarIndex from '../components/LoggedBar/LoggedBarIndex';
import useCoordinate from '../components/useCoordinate';
import useSession from '../components/useSession';
import LocalButton from '../components/LocalButton/LocalButton';
import Menu from '../components/Menu/Menu';
import MyCart from '../components/MyCart/MyCart';
import FastPromotion from '../components/FastPromotion';
import Search from '../components/Search/Search';

const useStyles = makeStyles((theme) => ({
  link: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    maxHeight: theme.spacing(25),
    color: theme.palette.common.white,
  },
  containerMarginFix4: {
    marginTop: theme.spacing(4),
  },
  searchContainer: {
    backgroundColor: theme.palette.grey[200],
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

const Transition = React.forwardRef((
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) => <Slide direction="up" ref={ref} {...props} />);

const promos = () => {
  const classes = useStyles();
  const [cartProducts, setCartProducts] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [inputEndereco, setInputEndereco] = useState<string | undefined>();
  const [inputNome, setInputNome] = useState<string | undefined>();
  const [lastEndereco, setLastEndereco] = useState(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [xsMenu, setXsMenu] = useState(false);
  const [endereco, setEndereco] = useState('');
  // const [isValidAddress, setIsValidAddress] = useState({ ok: true, helperText: undefined });
  // const [loadingAddressField, setLoadingAddressField] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [requiredDialog, setRequiredDialog] = useState(true);
  const [alertGeocode, setAlertGeocode] = useState(false);
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const session: any = useSession(false);
  const coordinates:any = useCoordinate;

  const getLevelAddress = (addressParts: any[], levelDescription: string) => addressParts.find((addressPart) => addressPart.types.includes(levelDescription));

  const getShortAddress = (addressComponents: any[]) => {
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

  const handleDangerClose = (event: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertGeocode(false);
  };

  useEffect(() => {
    const valor = cartProducts.map(
      (item) => Number(item.product.valor) * item.quantity,
    );
    const calcTotalValue = valor.reduce((a, b) => a + b, 0);
    setTotalValue(calcTotalValue);
  }, [cartProducts]);

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

  const changeEndereco = (selectedAddress: React.SetStateAction<string>) => {
    setEndereco(selectedAddress);
  };

  useEffect(() => {
    setLastEndereco(localStorage.getItem('ComprarNoZapEnderecoCurto'));
    if (localStorage.getItem('ComprarNoZapEnderecoCurto')) {
      setRequiredDialog(false);
    } else {
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

  useEffect(() => {
    setInputEndereco(localStorage.getItem('ComprarNoZapEndereco') || session.profile.endereco || '');
    setInputNome(session.profile.nome || '');
  }, [session.profile.loaded]);

  const setLatLong = (latLng: google.maps.LatLngLiteral) => {
    const coordinatesToSave = { latitude: latLng.lat, longitude: latLng.lng };
    localStorage.setItem('ComprarNoZapLatLng', JSON.stringify(coordinatesToSave));
    coordinates.allowed = true;
    handleDialogClose();
  };

  const setGeolocation = ({ coords }:any) => {
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

  const handleAddressSelect = (address: string) => {
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

  const removeItem = (id: number) => {
    let newItems = [];
    const filterProducts = (product: any) => product.product.id !== id;
    newItems = cartProducts.filter(filterProducts);
    setCartProducts(newItems);
  };

  const removeAll = () => {
    setCartProducts([]);
  };

  const changeItemQuantity = (id: number, quantidade: number) => {
    let newItems = [];
    const itemToChange = cartProducts.find(
      (product) => product.product.id === id,
    );
    itemToChange.quantity = quantidade;
    newItems = [...cartProducts];
    setCartProducts(newItems);
  };

  const handleXsMenuOpen = () => {
    setXsMenu(true);
  };

  const handleXsMenuClose = () => {
    setXsMenu(false);
  };

  const askGeolocation = () => {
    navigator.geolocation.getCurrentPosition(setGeolocation);
  };

  const adicionar = (item: any) => {
    let newItems = [];
    const existentItem = cartProducts.find(
      (product) => product.product.id === item.product.id,
    );
    if (existentItem) {
      existentItem.quantity += item.quantity;
      newItems = [...cartProducts];
    } else {
      newItems = [...cartProducts, item];
    }
    setCartProducts(newItems);
  };

  const showingCart = cartProducts.length > 0;

  // const verifyAddress = async (address:any) => {
  //   setLoadingAddressField(true);
  //   const result = await geocodeByAddress(address)
  //     .then((results) => {
  //       const completeAddress = results[0];
  //       const street = getLevelAddress(completeAddress.address_components, 'route');
  //       if (street) {
  //         setIsValidAddress({ ok: true, helperText: undefined });
  //         return true;
  //       }
  //       setIsValidAddress({ ok: false, helperText: 'Preencha o endereço completo (Rua e número da casa)' });
  //       return false;
  //     })
  //     .catch((error) => error);
  //   setLoadingAddressField(false);
  //   return result;
  // };

  const searchOnChange = (e: any) => {
    setSearchInput(e.target.value);
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
      <Divider />
      <Grid container justify="center" className={classes.searchContainer}>
        <Grid item xs={11} sm={8}>
          <Search onChange={searchOnChange} value={searchInput} />
        </Grid>
      </Grid>
      <FastPromotion onAdd={adicionar} lastEndereco={lastEndereco} searchInput={searchInput} howMany={50} />
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
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
                      // error={!isValidAddress.ok}
                      // helperText={!isValidAddress.ok && isValidAddress.helperText}
                      // disabled={loadingAddressField}
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
      <Slide direction="up" in={showingCart}>
        <AppBar position="fixed" className={classes.appBar} color="primary">
          <Container>
            <Box pb={2} pt={2}>
              <MyCart
                cartProducts={cartProducts}
                totalValue={totalValue}
                changeItemQuantity={changeItemQuantity}
                removeItem={removeItem}
                removeAll={removeAll}
                initialEndereco={inputEndereco}
                initialNome={inputNome}
              />
            </Box>
          </Container>
        </AppBar>
      </Slide>
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

export default promos;
