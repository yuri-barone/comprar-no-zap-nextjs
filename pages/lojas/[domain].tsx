/* eslint-disable max-len */
import {
  AppBar, Box, Button, Container, Divider, Grid, makeStyles, Slide, ThemeProvider, Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import MyCart from '../../components/MyCart/MyCart';
import ProductCard from '../../components/ProductCard/ProductCard';
import perfisService from '../../components/services/perfisService';
import productsService from '../../components/services/productsService';
import PedirNoZapTheme from '../../styles/PedirNoZapTheme';
import useSession from '../../components/useSession';
import EnterpriseExclusive from '../../components/EnterpriseCard/EnterpriseExclusive';
import ImageFeedback from '../../components/ImageFeedback/ImageFeedback';
import Search from '../../components/Search/Search';
import useLikeActions from '../../components/ProductCard/useLikeActions';

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
  fullHeight: {
    height: '100%',
  },
  logo: {
    width: '100%',
  },
  scroll: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.modal + 1,
  },
}));

// eslint-disable-next-line max-len
const Catalogo = ({ perfil = { isFallBack: true }, produtos = [] }:{perfil:any, produtos: any[]}) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [inputEndereco, setInputEndereco] = useState<string | undefined>();
  const [inputNome, setInputNome] = useState<string | undefined>();
  const [totalValue, setTotalValue] = useState(0);
  const [searchInput, setSearchInput] = useState<string | undefined>(undefined);
  const [productsData, setProductsData] = useState(produtos);
  const [isTheSamePerfil, setIsTheSamePerfil] = useState(false);
  const [shoppingCartOpen, setShoppingCartOpen] = useState(false);

  const session: any = useSession(false);
  const classes = useStyles();
  const showingCart = cartProducts.length > 0;
  const likeActions = useLikeActions();

  const isFallBack = () => !(perfil?.id > 0);

  const compareProducts = async () => {
    const res = await productsService.findOptimized(undefined, perfil.id);
    if (res.data?.data?.length === produtos.length) {
      return;
    }
    setProductsData(res.data?.data);
  };

  useEffect(() => {
    compareProducts();
    return () => {
      setProductsData(produtos);
    };
  }, []);

  useEffect(() => {
    if (isFallBack()) {
      return;
    }
    setInputEndereco(session.profile.endereco || '');
    setInputNome(session.profile.nome || '');

    if (session.profile.id === perfil.id) {
      setIsTheSamePerfil(true);
    }
  }, [session.profile.loaded]);

  useEffect(() => {
    if (isFallBack()) {
      return;
    }
    const valor = cartProducts.map(
      (item) => Number(item.product.valor) * item.quantity,
    );
    const calcTotalValue = valor.reduce((a, b) => a + b, 0);
    setTotalValue(calcTotalValue);
  }, [cartProducts]);

  const normalizeText = (text:string) => text.toLowerCase().normalize('NFD').replace(/[^a-z0-9&\-\s]/g, '');

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (!!searchInput && !isFallBack()) {
        const produtosFiltrados = produtos.filter((produto) => {
          const pesquisa = normalizeText(searchInput);
          const camposProduto = normalizeText(`${produto.titulo} ${produto.descricao}`);
          return camposProduto.match(pesquisa);
        });
        setProductsData(produtosFiltrados);
      }
      if (searchInput === undefined) {
        setProductsData(produtos);
      }
    }, 500);

    return () => clearInterval(searchTimeout);
  }, [searchInput]);

  const toggleOpened = (opened: boolean) => {
    setShoppingCartOpen(opened);
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
    toggleOpened(newItems.length === 1);
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
    const link = `https://api.whatsapp.com/send?phone=${perfil?.prefix}${perfil?.zap}&text=Ol%C3%A1,%20te%20encontrei%20no%20*comprarnozap.com*,%20mas%20você%20ainda%20não%20cadastrou%20os%20seus%20produtos.%0aConsegue%20cadastrar%20ou%20me%20enviar%20o%20seu%20catálogo%20por%20favor? `;
    const win = window.open(link, '_blank');
    win.focus();
  };

  const searchOnChange = (e: any) => {
    setSearchInput(e.target.value);
  };

  const handleToggleLikeProduct = (productId: number) => {
    let direction = 1;

    const newProductsData = productsData.map((product:any) => {
      if (product.id === productId) {
        direction = product.liked ? -1 : 1;
        return { ...product, liked: direction > 0, likecount: product.likecount + direction };
      }
      return product;
    });

    setProductsData(newProductsData);

    if (direction > 0) {
      likeActions.likeProduct(productId);
    } else {
      likeActions.dislikeProduct(productId);
    }
  };

  return (
    <ThemeProvider theme={PedirNoZapTheme}>
      {isFallBack()
      && (
        <Container>
          <Grid container alignItems="center" justify="center" className={classes.fullHeight}>
            <Grid item xs={6}>
              <Box pt={3}>
                <img
                  alt=""
                  src="/comprar-no-zap.svg"
                  className={classes.logo}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box pb={3}>
                <Typography align="center" variant="h6">Ops! Este catálogo ainda não existe.</Typography>
                <Typography gutterBottom align="center">Cadastre-se para colocar seus produtos aqui. É GRÁTIS, mas corra antes que alguém utilize este domínio!</Typography>
              </Box>
            </Grid>

            <Grid item xs="auto">
              <Link href="/search?tipo=0">
                <Button variant="outlined" color="primary">Continuar procurando</Button>
              </Link>
              {'   '}
              <Link href="/cadastro">
                <Button variant="contained" color="primary">Cadastrar minha loja</Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      )}

      {!isFallBack()
      && (
      <>
        <Grid container className={classes.enterpriseShow}>
          <Grid item xs={12}>
            <Container>
              <Box pt={2} pb={2}>
                <EnterpriseExclusive perfil={perfil} isTheSamePerfil={isTheSamePerfil} whiteText />
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
                { productsData?.map((item) => (
                  <Grid item xs={12} md={6} sm={6} lg={3} key={item.id}>
                    <ProductCard product={item} onAdd={adicionar} toggleLike={handleToggleLikeProduct} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {productsData?.length === 0 && !searchInput && (
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
            {productsData?.length === 0 && searchInput && (
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
                    open={shoppingCartOpen}
                    toggleOpened={toggleOpened}
                  />
                </Box>
              </Container>
            </AppBar>
          </Slide>
        </Container>
      </>
      )}
    </ThemeProvider>
  );
};

export async function getStaticProps({ params }:any) {
  const perfilResponse = await perfisService.getPerfilByDomain(params.domain);
  let produtosResponse;
  if (perfilResponse?.data?.id) {
    produtosResponse = await productsService.findOptimized(undefined, perfilResponse.data.id, undefined, 400);
  }

  const perfil = perfilResponse?.data || { isFallback: true };
  const produtos = produtosResponse.data?.data || [];
  return {
    props: { perfil, produtos },
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
