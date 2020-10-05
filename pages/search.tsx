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
import React, { useEffect, useMemo, useState } from "react";
import EnterpriseCard from "../components/EnterpriseCard/EnterpriseCard";
import MyAppBar from "../components/MyAppBar/MyAppBar";
import MyCart from "../components/MyCart/MyCart";
import ProductCard from "../components/ProductCard/ProductCard";
import Search from "../components/Search/Search";
import perfisService from "../components/services/perfisService";
import productsService from "../components/services/productsService";
import { ThemeProvider } from "@material-ui/core/styles";
import PedirNoZapTheme from "../styles/PedirNoZapTheme";

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
    backgroundColor: theme.palette.background.default,
    maxHeight: theme.spacing(25),
  },
  showingCart: {
    paddingBottom: theme.spacing(25),
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
  tabColor:{
    backgroundColor: "#FFFFFF"
  }
}));

export default function Home() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [productsData, setProductsData] = useState([]);
  const [locaisData, setLocaisData] = useState([]);
  const [lastFilter, setLastFilter] = useState("");
  const [cartProducts, setCartProducts] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const getUrlParams = () => {
    const url = new URL(window.location.href);
    var urlParams = new URLSearchParams(url.search);
    const params = {
      tipo: urlParams.get("tipo"),
      termo: urlParams.get("termo"),
    };
    return params;
  };

  useEffect(() => {
    const params = getUrlParams();
    setTabValue(parseInt(params.tipo));
    setLastFilter(params.termo);
  }, []);

  useEffect(() => {
    buscar(lastFilter);
  }, [tabValue]);

  useEffect(() => {
    const valor = cartProducts.map((item) => {
      return Number(item.product.valor) * item.quantity;
    });
    const calcTotalValue = valor.reduce((a, b) => a + b, 0);
    setTotalValue(calcTotalValue);
  }, [cartProducts]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      buscar(lastFilter);
    }, 500);
    return () => {
      clearInterval(searchTimeout);
    };
  }, [lastFilter]);

  const buscar = (filter: string) => {
    if (tabValue == 0 && !!filter) {
      getProducts(filter);
    }
    if (tabValue == 1 && !!filter) {
      getLocais(filter);
    }
  };
  const getProducts = async (filter: string) => {
    try {
      const productResponse = await productsService.find(filter);
      setProductsData(productResponse.data.data);
      setLastFilter(filter);
    } catch (error) {
      console.log(error);
    }
  };
  const getLocais = async (filter: string) => {
    try {
      const localResponse = await perfisService.find(filter);
      setLocaisData(localResponse.data.data);
      setLastFilter(filter);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTab = (e: any, value: number) => {
    setTabValue(value);
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
    setLastFilter(e.target.value);
  };

  return (
    <ThemeProvider theme={PedirNoZapTheme}>
      <MyAppBar
        value={lastFilter}
        onChange={searchOnChange}
        onSearch={buscar}
      ></MyAppBar>
      <Container>
        <Grid container spacing={4} >
          <Grid item xs="auto" >
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
      <Divider />
      <Container>
        <Grid
          container
          spacing={4}
          className={showingCart ? classes.showingCart : classes.hiddenCart}
        >
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
          <AppBar position="fixed" className={classes.appBar}>
            <Box p={2}>
              <Container>
                <MyCart
                  cartProducts={cartProducts}
                  totalValue={totalValue}
                  changeItemQuantity={changeItemQuantity}
                  removeItem={removeItem}
                  removeAll={removeAll}
                ></MyCart>
              </Container>
            </Box>
          </AppBar>
        </Slide>
      </Container>
    </ThemeProvider>
  );
}
