/* eslint-disable max-len */
import {
  Container,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Theme,
  makeStyles,
  CircularProgress,
  Grid,
  Typography,
  Box,
  Link,
  Hidden,
  Divider,
  IconButton,
  Dialog,
  Slide,
  Button,
  TextField,
  Snackbar,
} from '@material-ui/core';
import {
  Alert,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TransitionProps } from '@material-ui/core/transitions';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import LocalButton from '../components/LocalButton/LocalButton';
import LoggedBarIndex from '../components/LoggedBar/LoggedBarIndex';
import ordersService from '../components/services/ordersService';
import useSession from '../components/useSession';
import useCoordinate from '../components/useCoordinate';
import Menu from '../components/Menu/Menu';
import ImageFeedback from '../components/ImageFeedback/ImageFeedback';

const searchOptions = {
  componentRestrictions: { country: ['br'] },
};

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef((props: TransitionProps,
  ref: React.Ref<unknown>) => <Slide direction="up" ref={ref} {...props} />);

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 700,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  paper: {
    padding: '6px 16px',
  },
  primaryTail: {
    backgroundColor: theme.palette.primary.main,
  },
  dataSize: {
    fontSize: '0.6 rem',
    paddingBottom: theme.spacing(2),
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
  missingItems: {
    minHeight: 'calc(100vh - 200px)',
  },
}));

const meuspedidos = () => {
  const classes = useStyles();
  const session = useSession(true);
  const coordinates = useCoordinate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [lastEndereco, setLastEndereco] = useState(undefined);
  const [requiredDialog, setRequiredDialog] = useState(true);
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [xsMenu, setXsMenu] = useState(false);
  const [endereco, setEndereco] = useState('');
  const [alertGeocode, setAlertGeocode] = useState(false);

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
    checkIsBlocked();
  }, []);

  const loadOrders = async () => {
    const res = await ordersService.getOrderByConsumerid(session.profile.id);
    setOrders(res.data);
    setLoadingOrders(false);
  };

  const formatedOrders = useMemo(() => {
    const orderMap:any = {};
    for (let index = 0; index < orders.length; index += 1) {
      const order = orders[index];
      if (orderMap[order.id]) {
        orderMap[order.id].items.push(order.nomeproduto);
      } else {
        orderMap[order.id] = { ...order, items: [order.nomeproduto] };
      }
    }
    return Object.values(orderMap).reverse();
  }, [orders]);

  useEffect(() => {
    if (session.profile.loaded === true) {
      loadOrders();
    }
  }, [session]);

  const getData = (data:string) => new Date(data).toLocaleString();

  const handleDialogClose = () => {
    if (!requiredDialog) {
      setOpenDialog(false);
    }
  };

  const handleDangerClose = (event:any, reason:any) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertGeocode(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleXsMenuOpen = () => {
    setXsMenu(true);
  };

  const handleXsMenuClose = () => {
    setXsMenu(false);
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

  const setLatLong = (latLng:any) => {
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

  const changeEndereco = (selectedAddress:string) => {
    setEndereco(selectedAddress);
  };

  const askGeolocation = () => {
    navigator.geolocation.getCurrentPosition(setGeolocation);
  };

  return (
    <Grid container spacing={2}>
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
      <Grid item xs={12}>
        <Typography align="center" color="textSecondary" variant="h5">
          Meus pedidos
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Container>
          {!loadingOrders && formatedOrders.length === 0 && (
          <Grid container alignContent="center" className={classes.missingItems}>
            <Grid item xs={12}>
              <ImageFeedback
                image="/Jhon-Travolta.gif"
                message="Ahhh! você ainda não fez pedidos."
              />
            </Grid>
          </Grid>
          )}
          {loadingOrders && <CircularProgress size={50} className={classes.buttonProgress} />}
          {!loadingOrders && (
            <Timeline align="alternate">
              {formatedOrders.map((order:any) => (
                <TimelineItem key={order.id}>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector className={classes.primaryTail} />
                  </TimelineSeparator>
                  <Box pb={2} />
                  <TimelineContent>
                    <Typography variant="h6" component="h1" color="primary">
                      <Link href={`/lojas/${order.link}`}>
                        {order.nomeloja}
                      </Link>
                    </Typography>
                    <Box pt={2} pb={2}>
                      {order.items.map((item:string) => (
                        <Typography key={order.items.indexOf(item)} variant="body2" color="textSecondary">
                          {item}
                        </Typography>
                      ))}
                    </Box>
                    <Typography component="span" variant="caption" color="textSecondary" className={classes.dataSize}>
                      {getData(order.createdAt)}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </Container>
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
    </Grid>
  );
};

export default meuspedidos;
