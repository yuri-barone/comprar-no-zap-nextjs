import {
  AppBar,
  Box,
  Container,
  Divider,
  Grid,
  Hidden,
  makeStyles,
  Slide,
  Tab,
  Tabs,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
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
  const session:any = useSession(false);
  const navigation:any = useNavigation();

  // eslint-disable-next-line consistent-return
  const getLocais = async (filter: string) => {
    try {
      const localResponse = await perfisService.find(filter);
      setLocaisData(localResponse.data.data);
    } catch (error) {
      return error;
    }
  };

  // eslint-disable-next-line consistent-return
  const getProducts = async (termo: string | undefined, storeId?: number) => {
    try {
      const productResponse = await productsService.findOptimized(termo, storeId);
      setProductsData(productResponse.data.data);
    } catch (error) {
      return error;
    }
  };

  const buscar = (term: string | undefined, wich?:number, storeId?: number) => {
    if (wich === 0) {
      getProducts(term, storeId);
    }
    if (wich === 1) {
      getLocais(term);
    }
  };

  // eslint-disable-next-line consistent-return
  const loadCurrentStoreToShow = async (id:number) => {
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
    buscar(params.termo, parseInt(params.tipo, 10), lojaId);
    setCurrentStoreToShow(null);

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
    const valor = cartProducts.map((item) => Number(item.product.valor) * item.quantity);
    const calcTotalValue = valor.reduce((a, b) => a + b, 0);
    setTotalValue(calcTotalValue);
  }, [cartProducts]);

  useEffect(() => {
    const params = navigation.getUrlParams();
    const searchTimeout = setTimeout(() => {
      buscar(params.termo, tabValue, parseInt(params.perfilId, 10));
      setTabValue(parseInt(params.tipo, 10));
      setSearchInput(params.termo);
    }, 500);
    return () => {
      clearInterval(searchTimeout);
    };
  }, [tabValue]);

  const addSearchToUrl = (value:string) => {
    const params = navigation.getUrlParams();
    const query:any = navigation.generateQueryUrl(params.tipo, value);
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
    setInputEndereco(session.profile.endereco || '');
  }, [session.profile.loaded]);

  const handleChangeTab = (e: any, value: number) => {
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
    const query = navigation.generateQueryUrl('0', undefined, store.id.toString());
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
  return (
    <ThemeProvider theme={PedirNoZapTheme}>
      {session.isAutheticated && (
      <MyAppBarLogged
        value={searchInput}
        onChange={searchOnChange}
        onSearch={buscar}
        src={session.isAutheticated && session.profile['picture.imgBase64']}
        name={session.isAutheticated && session.profile.nome}
        zap={session.isAutheticated && session.profile.zap}
      />
      )}
      {!session.isAutheticated && (
        <MyAppBar
          value={searchInput}
          onChange={searchOnChange}
          onSearch={buscar}
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
                  <Tab label="Produtos" />
                  <Tab label="Locais" />
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
                  <Tab label="Produtos" />
                  <Tab label="Locais" />
                </Tabs>
              </Grid>
              <Grid item xs />
            </Grid>
          </Container>
        </Hidden>
      </Box>
      <Divider />
      <Container>
        <Grid
          container
          spacing={4}
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
            />
          </Grid>
          )}

          <Grid item xs={12} className={classes.containerMarginFix4}>
            <Grid container alignItems="stretch" spacing={4}>
              {tabValue === 0
                && productsData.map((item) => (
                  <Grid item xs={12} md={6} sm={3} key={item.id}>
                    <ProductCard product={item} onAdd={adicionar} />
                  </Grid>
                ))}
            </Grid>

            <Grid container alignItems="stretch" spacing={4}>
              {tabValue === 1
                && locaisData.map((item) => (
                  <Grid item xs={12} md={12} sm={6} key={item.id}>
                    <EnterpriseCard
                      onNavigate={currentStore}
                      id={item.id}
                      name={item.nome}
                      zap={item.zap}
                      endereco={item.endereco}
                      src={item.imgBase64}
                    />
                  </Grid>
                ))}
            </Grid>
          </Grid>
        </Grid>
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
                />
              </Box>
            </Container>
          </AppBar>
        </Slide>
      </Container>
    </ThemeProvider>
  );
}
