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
  Fab,
  Grid,
  Hidden,
  IconButton,
  makeStyles,
  Slide,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  useScrollTrigger,
} from '@material-ui/core';
import Zoom from '@material-ui/core/Zoom';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Alert } from '@material-ui/lab';
import EnterpriseCard from '../components/EnterpriseCard/EnterpriseCard';
import EnterpriseCardShow from '../components/EnterpriseCard/EnterpriseCardShow';
import MyAppBar from '../components/MyAppBar/MyAppBar';
import MyAppBarLogged from '../components/MyAppBar/MyAppBarLogged';
import MyCart from '../components/MyCart/MyCart';
import ProductCard from '../components/ProductCard/ProductCard';
import perfisService from '../components/services/perfisService';
import productsService from '../components/services/productsService';
import PedirNoZapTheme from '../styles/PedirNoZapTheme';
import useSession from '../components/useSession';
import useNavigation from '../components/useNavigation';
import ImageFeedback from '../components/ImageFeedback/ImageFeedback';
import useCoordinate from '../components/useCoordinate';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    maxHeight: theme.spacing(25),
    color: theme.palette.common.white,
  },
  showingCart: {
    paddingBottom: theme.spacing(28),
  },
  hiddenCart: {},
  img: {
    objectFit: 'cover',
  },
  imgDiv: {
    padding: 20,
  },
  containerMarginFix4: {
    marginTop: theme.spacing(4),
  },
  tabColor: {
    backgroundColor: '#FFFFFF',
  },
  missingItems: {
    minHeight: 'calc(100vh - 136px)',
  },
  clickable: {
    cursor: 'pointer',
  },
  scroll: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.modal + 1,
  },
}));

export default function Home() {
  const Router = useRouter();
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [productsData, setProductsData] = useState([]);
  const [locaisData, setLocaisData] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const [currentStoreToShow, setCurrentStoreToShow] = useState<any>(null);
  const [inputEndereco, setInputEndereco] = useState<string | undefined>();
  const [inputNome, setInputNome] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  const [termToFind, setTermToFind] = useState<string | undefined>('');
  const [storeIdToFind, setStoreIdToFind] = useState<number | undefined>(null);

  const [lastSearchProductHash, setLastSearchProductHash] = useState<string | undefined>(null);
  const [lastSearchPlaceHash, setLastlastSearchPlaceHash] = useState<string | undefined>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [endereco, setEndereco] = useState('');
  const [lastEndereco, setLastEndereco] = useState(undefined);
  const [requiredDialog, setRequiredDialog] = useState(true);
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [alertGeocode, setAlertGeocode] = useState(false);

  const session: any = useSession(false);
  const navigation: any = useNavigation();
  const coordinates = useCoordinate();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleDangerClose = (event:any, reason:any) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertGeocode(false);
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

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    if (!requiredDialog) {
      setOpenDialog(false);
    }
  };

  // eslint-disable-next-line consistent-return
  const getLocais = useCallback(async () => {
    try {
      const localResponse = await perfisService.find(
        termToFind,
        JSON.parse(localStorage.getItem('ComprarNoZapLatLng')),
      );
      return localResponse.data.data;
    } catch (error) {
      return [];
    }
  }, [termToFind, coordinates]);

  const getProducts = useCallback(async () => {
    try {
      const productResponse = await productsService.findOptimized(
        termToFind,
        storeIdToFind,
        JSON.parse(localStorage.getItem('ComprarNoZapLatLng')),
      );
      return productResponse.data.data;
    } catch (error) {
      return [];
    }
  }, [termToFind, storeIdToFind, coordinates]);

  const aplicarFiltrosAoEstado = async (
    term: string | undefined,
    storeId?: number,
  ) => {
    setTermToFind(term);
    setStoreIdToFind(storeId);
  };

  // eslint-disable-next-line consistent-return
  const loadCurrentStoreToShow = async (id: number) => {
    try {
      const currentStoreResponse = await perfisService.get(id);
      setCurrentStoreToShow(currentStoreResponse.data);
    } catch (error) {
      return error;
    }
  };

  const handleUrlChange = () => {
    const params = navigation.getUrlParams();
    const lojaId = parseInt(params.perfilId, 10);
    setSearchInput(params.termo);
    setTabValue(parseInt(params.tipo, 10));
    setCurrentStoreToShow(null);

    aplicarFiltrosAoEstado(params.termo, lojaId);

    if (lojaId > 0) {
      loadCurrentStoreToShow(lojaId);
    }
  };

  useEffect(() => {
    Router.events.on('routeChangeComplete', handleUrlChange);
    return () => {
      Router.events.off('routeChangeComplete', handleUrlChange);
    };
  }, []);

  useEffect(() => {
    const valor = cartProducts.map(
      (item) => Number(item.product.valor) * item.quantity,
    );
    const calcTotalValue = valor.reduce((a, b) => a + b, 0);
    setTotalValue(calcTotalValue);
  }, [cartProducts]);

  useEffect(() => {
    const params = navigation.getUrlParams();
    aplicarFiltrosAoEstado(params.termo, parseInt(params.perfilId, 10));
    setSearchInput(params.termo);
  }, [tabValue]);

  const addSearchToUrl = (value: string) => {
    const params = navigation.getUrlParams();
    const query: any = navigation.generateQueryUrl(params.tipo, value);
    if (parseInt(params.perfilId, 10)) {
      query.perfilId = params.perfilId;
    }
    Router.push({
      pathname: '/search',
      query,
    });
  };

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      const params = navigation.getUrlParams();
      if (searchInput !== undefined && params.termo !== searchInput) {
        addSearchToUrl(searchInput);
      }
    }, 500);
    return () => {
      clearInterval(searchTimeout);
    };
  }, [searchInput]);

  useEffect(() => {
    setInputEndereco(localStorage.getItem('ComprarNoZapEndereco') || session.profile.endereco || '');
    setInputNome(session.profile.nome || '');
  }, [session.profile.loaded]);

  const executaBuscaParaTabSelecionada = async () => {
    const hash = `${termToFind}_${storeIdToFind}`;
    if (tabValue === 1 && lastSearchProductHash !== hash) {
      setIsLoading(true);
      setLastSearchProductHash(hash);
      const products = await getProducts();
      setProductsData(products);
      setIsLoading(false);
    }
    if (tabValue === 0 && lastSearchPlaceHash !== hash) {
      setIsLoading(true);
      setLastlastSearchPlaceHash(hash);
      const places = await getLocais();
      setLocaisData(places);
      setIsLoading(false);
    }
  };

  // Hook principal de buscas
  useEffect(() => {
    const executarBuscaTimeout = setTimeout(executaBuscaParaTabSelecionada, 100);
    return () => clearTimeout(executarBuscaTimeout);
  }, [
    termToFind,
    storeIdToFind,
    tabValue,
    coordinates.loading,
    coordinates.position,
  ]);

  const handleChangeTab = (e: any, value: number) => {
    setTabValue(value);
    const params = navigation.getUrlParams();
    const query = navigation.generateQueryUrl(value.toString(), params.termo);
    Router.push({
      pathname: '/search',
      query,
    });
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

  const changeItemQuantity = (id: number, quantidade: number) => {
    let newItems = [];
    const itemToChange = cartProducts.find(
      (product) => product.product.id === id,
    );
    itemToChange.quantity = quantidade;
    newItems = [...cartProducts];
    setCartProducts(newItems);
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

  const searchOnChange = (e: any) => {
    setSearchInput(e.target.value);
  };

  const currentStore = (store: any) => {
    const query = navigation.generateQueryUrl(
      '1',
      undefined,
      store.id.toString(),
    );
    Router.push({
      pathname: '/search',
      query,
    });
  };

  const removeStore = () => {
    const query = navigation.generateQueryUrl('0', searchInput);
    Router.push({
      pathname: '/search',
      query,
    });
  };

  const solicitarCatalogo = () => {
    const link = `https://api.whatsapp.com/send?phone=${currentStoreToShow.prefix}${currentStoreToShow.zap}&text=Ol%C3%A1,%20te%20encontrei%20no%20*comprarnozap.com*,%20mas%20você%20ainda%20não%20cadastrou%20os%20seus%20produtos.%0aConsegue%20cadastrar%20ou%20me%20enviar%20o%20seu%20catálogo%20por%20favor? `;
    const win = window.open(link, '_blank');
    win.focus();
  };

  const onTalk = () => {
    const link = `https://api.whatsapp.com/send?phone=${currentStoreToShow.prefix}${currentStoreToShow.zap}&text=Ol%C3%A1,%20te%20encontrei%20no%20*comprarnozap.com*`;
    const win = window.open(link, '_blank');
    win.focus();
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

  const setLatLong = async (latLng:any) => {
    const coordinatesToSave = { latitude: latLng.lat, longitude: latLng.lng };
    localStorage.setItem('ComprarNoZapLatLng', JSON.stringify(coordinatesToSave));
    coordinates.allowed = true;
    handleDialogClose();
    const hash = `${termToFind}_${storeIdToFind}`;
    setIsLoading(true);
    setLastlastSearchPlaceHash(hash);
    const places = await getLocais();
    const products = await getProducts();
    setProductsData(products);
    setLocaisData(places);
    setIsLoading(false);
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

  const handleAddressSelect = (address:string) => {
    geocodeByAddress(address)
      .then((results:any) => {
        const completeAddress = results[0];
        const shortAddress = getShortAddress(completeAddress.address_components);
        const superCompleteAddress = results[0].formatted_address;
        localStorage.setItem('ComprarNoZapEnderecoCurto', superCompleteAddress);
        setInputEndereco(superCompleteAddress);
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

  const handleClickTrigger = (section:string) => {
    const anchor = document.querySelector(section);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <ThemeProvider theme={PedirNoZapTheme}>
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
      <Box style={{ backgroundColor: 'white' }}>
        <Hidden xsDown>
          <Container>
            <Grid container>
              <Grid item xs="auto">
                <Tabs
                  value={tabValue}
                  onChange={handleChangeTab}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Locais" />
                  <Tab label="Produtos" />
                </Tabs>
              </Grid>
              <Grid item xs />
            </Grid>
          </Container>
        </Hidden>
        <Hidden smUp>
          <Container>
            <Grid container>
              <Grid item xs={12}>
                <Tabs
                  value={tabValue}
                  onChange={handleChangeTab}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab label="Locais" />
                  <Tab label="Produtos" />
                </Tabs>
              </Grid>
              <Grid item xs />
            </Grid>
          </Container>
        </Hidden>
      </Box>
      <Divider id="back-to-top-anchor" />
      <Container>
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
          <Grid
            container
            spacing={2}
            className={showingCart ? classes.showingCart : classes.hiddenCart}
          >
            {currentStoreToShow && (
            <Grid item xs={12} className={classes.containerMarginFix4}>
              <EnterpriseCardShow
                onRemove={removeStore}
                src={currentStoreToShow['picture.imgBase64']}
                name={currentStoreToShow.nome}
                endereco={currentStoreToShow.endereco}
                zap={currentStoreToShow.zap}
                id={currentStoreToShow.id}
                onTalk={onTalk}
              />
            </Grid>
            )}

            {productsData.length === 0 && currentStoreToShow && !searchInput && (
            <Grid item xs={12} className={classes.containerMarginFix4}>
              <ImageFeedback
                image="/Jhon-Travolta.gif"
                message="Ahhh! esta loja ainda não cadastrou seus produtos..."
                withButton
                buttonMessage="Solicitar catálogo de produtos"
                buttonOnClick={solicitarCatalogo}
              />
            </Grid>
            )}

            {productsData.length === 0 && currentStoreToShow && searchInput && (
            <Grid item xs={12} className={classes.containerMarginFix4}>
              <ImageFeedback
                image="/Jhon-Travolta.gif"
                message="Hmm... Nenhum produto foi encontrado com este nome."
                withButton
                buttonMessage="Solicitar catálogo de produtos"
                buttonOnClick={solicitarCatalogo}
              />
            </Grid>
            )}

            {productsData.length === 0 && tabValue === 1 && !currentStoreToShow && (
            <Grid item xs={12} className={classes.missingItems}>
              <Grid container alignContent="center" className={classes.missingItems}>
                <Grid item xs={12}>
                  <ImageFeedback
                    image="/Jhon-Travolta.gif"
                    message="Hmm... Nenhum produto foi encontrado com este nome."
                  />
                </Grid>
              </Grid>
            </Grid>
            )}

            {locaisData.length === 0 && tabValue === 0 && (
            <Grid item xs={12} className={classes.missingItems}>
              <Grid container alignContent="center" className={classes.missingItems}>
                <Grid item xs={12}>
                  <ImageFeedback
                    image="/Jhon-Travolta.gif"
                    message="Hmm... Nenhuma empresa foi encontrada com este nome."
                  />
                </Grid>
              </Grid>
            </Grid>
            )}

            <Grid item xs={12} className={classes.containerMarginFix4}>
              <Grid container alignItems="stretch" spacing={4}>
                {tabValue === 1
                && productsData.map((item) => (
                  <Grid item xs={12} md={6} sm={6} lg={3} key={item.id}>
                    <ProductCard product={item} onAdd={adicionar} />
                  </Grid>
                ))}
              </Grid>

              <Grid container alignItems="stretch" spacing={4}>
                {tabValue === 0
                && locaisData.map((item) => (
                  <Grid item xs={12} md={12} sm={12} lg={6} key={item.id}>
                    <EnterpriseCard
                      onNavigate={currentStore}
                      id={item.id}
                      name={item.nome}
                      zap={item.zap}
                      endereco={item.endereco}
                      pictureId={item.pictureId}
                      distance={item.distance}
                      prefix={item.prefix}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
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
        <Dialog
          open={openDialog}
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
      </Container>
      <Zoom in={trigger}>
        <div
          onClick={() => handleClickTrigger('#back-to-top-anchor')}
          role="presentation"
          className={classes.scroll}
        >
          <Fab color="primary" size="large" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </div>
      </Zoom>
    </ThemeProvider>
  );
}
