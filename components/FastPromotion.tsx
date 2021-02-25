import {
  Box,
  Collapse,
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import AdProductShow from './AdProductShow';
import promotionsService from './services/promotionsService';
import useChrono from './useChrono';

export type FastPromotionProps = {
  onAdd: (item:any) => void,
  lastEndereco?: string,
  howMany?: number,
  searchInput?: string,
  seeMore?: boolean,
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    maxHeight: theme.spacing(25),
    color: theme.palette.common.white,
  },
  chrono: {
    color: theme.palette.warning.dark,
  },
  promotions: {
    backgroundColor: theme.palette.grey[200],
  },
}));

const FastPromotion = ({
  onAdd, lastEndereco, howMany, searchInput, seeMore,
}:FastPromotionProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const size = useMediaQuery(theme.breakpoints.up('xs'));
  const [productsData, setProductsData] = useState([]);
  const [inicialPromos, setInicialPromos] = useState([]);

  const normalizeText = (text:string) => text.toLowerCase().normalize('NFD').replace(/[^a-z0-9&\-\s]/g, '');

  const loadPromos = async () => {
    let numberOfPromos = 2;
    if (!size) {
      numberOfPromos = 4;
    }
    const res = await promotionsService.findOptimized(
      true,
      JSON.parse(localStorage.getItem('ComprarNoZapLatLng')),
      howMany || numberOfPromos,
    );
    setInicialPromos(res.data);
    return res.data;
  };

  useEffect(() => {
    setProductsData(inicialPromos);
  }, [inicialPromos]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchInput) {
        const produtosFiltrados = inicialPromos.filter((inicialPromo) => {
          const pesquisa = normalizeText(searchInput);
          const camposProduto = normalizeText(`${inicialPromo.titulo} ${inicialPromo.descricao}`);
          return camposProduto.match(pesquisa);
        });
        setProductsData(produtosFiltrados);
      }
      if (searchInput === '') {
        setProductsData(inicialPromos);
      }
    }, 500);

    return () => clearInterval(searchTimeout);
  }, [searchInput]);

  useEffect(() => {
    const timeout = setTimeout(loadPromos, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    loadPromos();
    return () => setProductsData([]);
  }, [lastEndereco]);

  const remaining = useChrono();

  return (
    <Collapse in={productsData?.length > 0} timeout={500}>
      <Box pb={3} className={classes.promotions}>
        <Container>
          <Box pt={1}>
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs={12}>
                <Grid container alignItems="flex-end">
                  <Grid item xs={12} sm>
                    <Typography variant="body1" color="textSecondary">
                      Promoções Relâmpago
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Typography variant="body2" color="primary">
                      Acaba em
                      {' '}
                      <Box component="span" fontWeight="fontWeightBold">{remaining}</Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {productsData?.map((item) => (
                <Grid item xs={6} md={4} sm={4} lg={3} key={item.id}>
                  <AdProductShow product={item} onAdd={onAdd} />
                </Grid>
              ))}
              {seeMore && (
              <Grid item xs={12}>
                <Typography variant="body1" align="center">
                  <Link href="/promos">Ver mais</Link>
                </Typography>
              </Grid>
              )}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Collapse>
  );
};

export default FastPromotion;
