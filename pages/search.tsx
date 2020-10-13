import {
  AppBar,
  Box,
  Container,
  Divider,
  Grid,
  makeStyles,
  Slide,
  Tab,
  Tabs,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import EnterpriseCard from "../components/EnterpriseCard/EnterpriseCard";
import EnterpriseCardShow from "../components/EnterpriseCard/EnterpriseCardShow";
import MyAppBar from "../components/MyAppBar/MyAppBar";
import MyAppBarLogged from "../components/MyAppBar/MyAppBarLogged";
import MyCart from "../components/MyCart/MyCart";
import ProductCard from "../components/ProductCard/ProductCard";
import perfisService from "../components/services/perfisService";
import productsService from "../components/services/productsService";
import { ThemeProvider } from "@material-ui/core/styles";
import PedirNoZapTheme from "../styles/PedirNoZapTheme";
import useSession from "../components/useSession";
import useNavigation from "../components/useNavigation";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
    backgroundColor: theme.palette.background.default,
    maxHeight: theme.spacing(25),
  },
  showingCart: {
    paddingBottom: theme.spacing(28),
  },
  hiddenCart: {},
  img: {
    objectFit: "cover",
  },
  imgDiv: {
    padding: 20,
  },
  containerMarginFix4: {
    marginTop: theme.spacing(4),
  },
  tabColor: {
    backgroundColor: "#FFFFFF",
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
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const [currentStoreToShow, setCurrentStoreToShow] = useState<any>(null);
  const [inputEndereco, setInputEndereco] = useState<string | undefined>()
  const session:any = useSession(false)
  const navigation:any = useNavigation()

  useEffect(() => {
    Router.events.on("routeChangeComplete", handleUrlChange);
    return () => {
      Router.events.off("routeChangeComplete", handleUrlChange)
    }
  }, []);

  useEffect(() => {
    const valor = cartProducts.map((item) => {
      return Number(item.product.valor) * item.quantity;
    });
    const calcTotalValue = valor.reduce((a, b) => a + b, 0);
    setTotalValue(calcTotalValue);
  }, [cartProducts]);

  useEffect(() => {
    const params = navigation.getUrlParams();
    const searchTimeout = setTimeout(() => {
      buscar(params.termo, tabValue, parseInt(params.perfilId));
      setTabValue(parseInt(params.tipo));
      setSearchInput(params.termo)
    }, 500);
    return () => {
      clearInterval(searchTimeout);
    };
  }, [tabValue]);

  const addSearchToUrl = (value:string) => {
        const params = navigation.getUrlParams();
    const query:any = navigation.generateQueryUrl(params.tipo, value)
    console.log(currentStoreToShow)
    if(parseInt(params.perfilId)){
      query.perfilId = params.perfilId;
    }   

    Router.push({
      pathname: "/search",
      query
    })
  }

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      const params = navigation.getUrlParams();
      if(params.termo !== searchInput){
        addSearchToUrl(searchInput)
      }
    }, 500);
    return () => {
      clearInterval(searchTimeout);
    };
  }, [searchInput]);

  useEffect(()=> {
      setInputEndereco(session.profile.endereco || "")
  }, [session.profile.loaded])

  const handleUrlChange = () => {
    const params = navigation.getUrlParams();
    const lojaId = parseInt(params.perfilId) 
    setSearchInput(params.termo);
    setTabValue(parseInt(params.tipo));
    buscar(params.termo, parseInt(params.tipo), lojaId);
    setCurrentStoreToShow(null)  
    
    if(lojaId > 0) {
      loadCurrentStoreToShow(lojaId)
    };
  };

  const loadCurrentStoreToShow = async (id:number) => {
    try {
      const currentStoreResponse = await perfisService.get(id);
      setCurrentStoreToShow(currentStoreResponse.data)
    } catch (error) {
      console.log()
    }
  }

  const buscar = (term: string | undefined, wich?:number, storeId?: number,) => {
    if (wich === 0) {
      getProducts(term, storeId);
    }
    if (wich == 1) {
      getLocais(term);
    }
  };

  const getProducts = async (termo: string | undefined, storeId?: number) => {
    try {
      const productResponse = await productsService.find(termo, storeId);
      setProductsData(productResponse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getLocais = async (filter: string) => {
    try {
      const localResponse = await perfisService.find(filter);
      setLocaisData(localResponse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTab = (e: any, value: number) => {
    const params = navigation.getUrlParams()
    const query = navigation.generateQueryUrl(value.toString(), params.termo)
    Router.push({
      pathname: "/search",
      query
    });
  };

  const adicionar = (item: any) => {
    let newItems = [];
    const existentItem = cartProducts.find(
      (product) => product.product.id === item.product.id
    );
    if (!!existentItem) {
      existentItem.quantity = existentItem.quantity + item.quantity;
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
      (product) => product.product.id === id
    );
    itemToChange.quantity = quantidade;
    newItems = [...cartProducts];
    setCartProducts(newItems);
  };

  const removeItem = (id: number) => {
    let newItems = [];
    const filterProducts = (product: any) => {
      return product.product.id != id;
    };
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
    const query = navigation.generateQueryUrl("0", undefined, store.id.toString())
    Router.push({
      pathname: "/search",
      query
    });
  };

  const removeStore = () => {
    const query = navigation.generateQueryUrl("0", searchInput)
    Router.push({
      pathname:"/search",
      query
    })
  }
  return (
    <ThemeProvider theme={PedirNoZapTheme}>
      {session.isAutheticated && <MyAppBarLogged
        value={searchInput}
        onChange={searchOnChange}
        onSearch={buscar}
        src={session.isAutheticated && session.profile["picture.imgBase64" ]}
        name={session.isAutheticated && session.profile.nome}
        zap={session.isAutheticated && session.profile.zap}
      ></MyAppBarLogged>}
      {!session.isAutheticated && <MyAppBar
        value={searchInput}
        onChange={searchOnChange}
        onSearch={buscar}
      ></MyAppBar>}
      <Box style={{backgroundColor:'white'}}>
      <Container >
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
          <Grid item xs></Grid>
        </Grid>
      </Container>
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
                src={currentStoreToShow["picture.imgBase64"]}
                name={currentStoreToShow.nome}
                endereco={currentStoreToShow.endereco}
                zap={currentStoreToShow.zap}
                id={currentStoreToShow.id}
              />
              </Grid>
            )}
          
          <Grid item xs={12} className={classes.containerMarginFix4}>
            <Grid container alignItems="stretch" spacing={4}>
              {tabValue == 0 &&
                productsData.map((item) => {
                  return (
                    <Grid item xs={12} sm={3} key={item.id}>
                      <ProductCard product={item} onAdd={adicionar} />
                    </Grid>
                  );
                })}
            </Grid>

            <Grid container alignItems="stretch" spacing={4}>
              {tabValue == 1 &&
                locaisData.map((item) => {
                  return (
                    <Grid item xs={12} sm={6} key={item.id}>
                      <EnterpriseCard
                        onNavigate={currentStore}
                        id={item.id}
                        name={item.nome}
                        zap={item.zap}
                        endereco={item.endereco}
                        src={item["picture.imgBase64"]}
                      />
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
        </Grid>
        <Slide direction="up" in={showingCart}>
          <AppBar position="fixed" className={classes.appBar} style={{backgroundColor:'#ece5dd'}}>
            <Box p={2}>
              <Container>
                <MyCart
                  cartProducts={cartProducts}
                  totalValue={totalValue}
                  changeItemQuantity={changeItemQuantity}
                  removeItem={removeItem}
                  removeAll={removeAll}
                  initialEndereco={inputEndereco}
                ></MyCart>
              </Container>
            </Box>
          </AppBar>
        </Slide>
      </Container>
    </ThemeProvider>
  );
}
