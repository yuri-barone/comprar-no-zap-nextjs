import {
  AppBar, Box, Container, Divider, Grid, makeStyles, Slide, ThemeProvider,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MyCart from '../../components/MyCart/MyCart';
import ProductCard from '../../components/ProductCard/ProductCard';
import perfisService from '../../components/services/perfisService';
import productsService from '../../components/services/productsService';
import PedirNoZapTheme from '../../styles/PedirNoZapTheme';
import useSession from '../../components/useSession';
import EnterpriseExclusive from '../../components/EnterpriseCard/EnterpriseExclusive';
import ImageFeedback from '../../components/ImageFeedback/ImageFeedback';
import Search from '../../components/Search/Search';

const useStyles = makeStyles((theme) => ({
  showingCart: {
    paddingBottom: theme.spacing(28),
  },
  hiddenCart: {},
  containerMarginFix4: {
    marginTop: theme.spacing(4),
  },
  enterpriseShow: {
    backgroundColor: theme.palette.primary.light,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    maxHeight: theme.spacing(25),
    color: theme.palette.common.white,
  },
}));

const Catalogo = ({ perfil = {}, produtos = [] }:{perfil:any, produtos: any[]}) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [inputEndereco, setInputEndereco] = useState<string | undefined>();
  const [inputNome, setInputNome] = useState<string | undefined>();
  const [totalValue, setTotalValue] = useState(0);
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const [productsData, setProductsData] = useState(produtos);
  const [isTheSamePerf, setIsTheSamePerf] = useState(false);

  const session: any = useSession(false);
  const classes = useStyles();
  const showingCart = cartProducts.length > 0;
  const router = useRouter();

  useEffect(() => {
    setInputEndereco(session.profile.endereco || '');
    setInputNome(session.profile.nome || '');
    if (session.profile.id === perfil.id) {
      setIsTheSamePerf(true);
    }
  }, [session.profile.loaded]);

  useEffect(() => {
    if (perfil === {}) {
      router.push('/search?tipo=0');
    }
  }, []);

  useEffect(() => {
    const valor = cartProducts.map(
      (item) => Number(item.product.valor) * item.quantity,
    );
    const calcTotalValue = valor.reduce((a, b) => a + b, 0);
    setTotalValue(calcTotalValue);
  }, [cartProducts]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchInput !== undefined) {
        const produtosFiltrados = produtos.filter((produto) => {
          const pesquisa = searchInput.toLowerCase();
          const titulo = produto.titulo.toLowerCase();
          return titulo.match(pesquisa);
        });
        setProductsData(produtosFiltrados);
      }
      if (searchInput === undefined) {
        setProductsData(produtos);
      }
    }, 500);
    return () => {
      clearInterval(searchTimeout);
    };
  }, [searchInput]);

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

  const solicitarCatalogo = () => {
    const link = `https://api.whatsapp.com/send?phone=55${perfil.zap}&text=Ol%C3%A1,%20te%20encontrei%20no%20*comprarnozap.com*,%20mas%20você%20ainda%20não%20cadastrou%20os%20seus%20produtos.%0aConsegue%20cadastrar%20ou%20me%20enviar%20o%20seu%20catálogo%20por%20favor? `;
    const win = window.open(link, '_blank');
    win.focus();
  };

  const searchOnChange = (e: any) => {
    setSearchInput(e.target.value);
  };

  return (
    <ThemeProvider theme={PedirNoZapTheme}>
      <Grid container className={classes.enterpriseShow}>
        <Grid item xs={12}>
          <Container>
            <Box p={2}>
              <EnterpriseExclusive perfil={perfil} isTheSamePerf={isTheSamePerf} />
            </Box>
          </Container>
        </Grid>
      </Grid>
      <Divider />
      <Container>
        <Grid
          container
          spacing={2}
          className={showingCart ? classes.showingCart : classes.hiddenCart}
        >
          <Grid item xs={12} className={classes.containerMarginFix4}>
            <Search onChange={searchOnChange} value={searchInput} />
          </Grid>
          <Grid item xs={12} className={classes.containerMarginFix4}>
            <Grid container alignItems="stretch" spacing={4}>
              { productsData.map((item) => (
                <Grid item xs={12} md={6} sm={6} lg={3} key={item.id}>
                  <ProductCard product={item} onAdd={adicionar} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          {productsData.length === 0 && !searchInput && (
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
          {productsData.length === 0 && searchInput && (
            <Grid item xs={12} className={classes.containerMarginFix4}>
              <ImageFeedback
                image="/Jhon-Travolta.gif"
                message="Hmm não encontramos produtos com este nome."
              />
            </Grid>
          )}
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
                  initialNome={inputNome}
                />
              </Box>
            </Container>
          </AppBar>
        </Slide>
      </Container>
    </ThemeProvider>
  );
};

export async function getStaticProps({ params }:any) {
  const profile = await perfisService.getPerfilByDomain(params.domain);
  const produtos = await productsService.findOptimized(undefined, profile.data.id);

  return {
    props: { perfil: profile.data, produtos: produtos.data.data },
  };
}

export async function getStaticPaths() {
  const allDomains = await perfisService.getAllDomains();
  const paths = allDomains.data.map((domain: any) => ({ params: { domain } }));

  return {
    paths,
    fallback: true,
  };
}

export default Catalogo;
