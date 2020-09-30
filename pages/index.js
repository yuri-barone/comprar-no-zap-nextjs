import {
  AppBar,
  Box,
  Container,
  Grid,
  makeStyles,
  Paper,
  Slide,
  Tab,
  Tabs,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import EnterpriseCard from "../components/EnterpriseCard/EnterpriseCard";
import MyCart from "../components/MyCart/MyCart";
import ProductCard from "../components/ProductCard/ProductCard";
import Search from "../components/Search/Search";
import perfisService from "../components/services/perfisService";
import productsService from "../components/services/productsService";

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
  hiddenCart :{},
}));

export default function Home() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [productsData, setProductsData] = useState([]);
  const [locaisData, setLocaisData] = useState([]);
  const [lastFilter, setLastFilter] = useState("");
  const [cartProducts, setCartProducts] = useState([]);
  const [totalValue, setTotalValue] = useState();

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

  const buscar = (filter) => {
    if (tabValue == 0 && !!filter) {
      getProducts(filter);
    }
    if (tabValue == 1 && !!filter) {
      getLocais(filter);
    }
  };
  const getProducts = async (filter) => {
    try {
      const productResponse = await productsService.find(filter);
      setProductsData(productResponse.data.data);
      setLastFilter(filter);
    } catch (error) {
      console.log(error);
    }
  };
  const getLocais = async (filter) => {
    try {
      const localResponse = await perfisService.find(filter);
      setLocaisData(localResponse.data.data);
      setLastFilter(filter);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTab = (e, value) => {
    setTabValue(value);
  };

  const adicionar = (item) => {
    let newItems = [];
    const existentItem = cartProducts.find((product) => product.id === item.id);
    if (!!existentItem) {
      existentItem.quantity = existentItem.quantity + item.quantity;
      newItems = [...cartProducts]
    } else {
      newItems = [...cartProducts, item];
    }
    setCartProducts(newItems);
  };
  const showingCart = cartProducts.length > 0;

  return (
    <Grid container spacing={3} className={showingCart ? classes.showingCart : classes.hiddenCart}>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item xs={2}>
            <h1>Pedir no Zap</h1>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item xs={8}>
            <Search onSearch={buscar} />
          </Grid>
        </Grid>
      </Grid>
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

      {tabValue == 0 &&
        productsData.map((item, index) => {
          return (
            <Grid item xs={3} key={index}>
              <ProductCard
                name={item.titulo}
                descricao={item.descricao}
                valor={item.valor}
                src={item["picture.imgBase64"]}
                id={item.id}
                onAdd={adicionar}
              />
            </Grid>
          );
        })}
      {tabValue == 1 &&
        locaisData.map((item, index) => {
          return (
            <Grid item xs={4} key={index}>
              <EnterpriseCard
                name={item.nome}
                zap={item.zap}
                endereco={item.endereco}
                src={item["picture.imgBase64"]}
              />
            </Grid>
          );
        })}

      <Grid item xs={12}>
        <Slide direction="up" in={showingCart}>
          <AppBar position="fixed" className={classes.appBar}>
            <Box p={2}>
              <Container>
                <MyCart
                  cartProducts={cartProducts}
                  totalValue={totalValue}
                ></MyCart>
              </Container>
            </Box>
          </AppBar>
        </Slide>
      </Grid>
    </Grid>
  );
}
