import {
  Box, Collapse, Container, Grid, makeStyles, Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import AdProductShow from './AdProductShow';
import promotionsService from './services/promotionsService';
import useChrono from './useChrono';

export type FastPromotionProps = {
  onAdd: (item:any) => void,
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

const FastPromotion = ({ onAdd }:FastPromotionProps) => {
  const classes = useStyles();
  const [productsData, setProductsData] = useState([]);

  const loadPromos = async () => {
    const res = await promotionsService.findOptimized(
      true,
      JSON.parse(localStorage.getItem('ComprarNoZapLatLng')),
      3,
    );
    setProductsData(res.data);
  };

  useEffect(() => {
    const timeout = setTimeout(loadPromos, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const remaining = useChrono();

  return (
    <Collapse in={productsData?.length > 0} timeout={500}>
      <Box pb={3} className={classes.promotions}>
        <Container>
          <Box pt={1}>
            <Grid container spacing={2}>
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
              {productsData.map((item) => (
                <Grid item xs={12} md={6} sm={6} lg={4} key={item.id}>
                  <AdProductShow product={item} onAdd={onAdd} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Collapse>
  );
};

export default FastPromotion;
