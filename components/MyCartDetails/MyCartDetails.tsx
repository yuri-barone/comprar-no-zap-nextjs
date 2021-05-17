import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import CartDetails from '../CartDetails/CartDetails';

export type MyCartDetailsProps = {
  cartProductsData: Array<any>;
  onContinuarComprando: () => void;
  changeItemQuantity: (id:number, quantity:number) => void;
  removeItem: (id:number) => void;
  removeAll: () => void;
  initialEndereco: string;
  initialNome: string;
};

const useStyles = makeStyles({
  root: {
    height: '100vh',
    overflowY: 'auto',
  },
  paper: {
    width: '100%',
    height: '100vh',
    paddingBottom: '70px',
    overflowX: 'hidden',
  },
});
const MyCartDetails = ({
  cartProductsData,
  onContinuarComprando,
  changeItemQuantity,
  removeItem,
  removeAll,
  initialEndereco,
  initialNome,
}: MyCartDetailsProps) => {
  const classes = useStyles();
  const [cartSellers, setCartSellers] = useState([]);
  const groupProductsBySeller = () => {
    const sellerProductsMap: any = {};
    cartProductsData.forEach((shoppItem: any) => {
      const sellerId = shoppItem.product.perfilId;
      sellerProductsMap[sellerId] = sellerProductsMap[sellerId] || {
        perfilName: shoppItem.product.nome,
        perfilPrefix: shoppItem.product.prefix,
        zap: shoppItem.product.zap,
        endereco: shoppItem.product.endereco,
        delivery: shoppItem.product.delivery,
        items: [],
      };
      sellerProductsMap[sellerId].items.push(shoppItem);
    });
    setCartSellers(Object.values(sellerProductsMap));
  };
  useMemo(groupProductsBySeller, [cartProductsData]);
  useEffect(() => {
    if (cartProductsData.length === 0) {
      onContinuarComprando();
    }
  }, [cartProductsData]);
  return (
    <div className={classes.root}>
      <Grid container>
        <Paper variant="outlined" className={classes.paper}>
          {cartSellers.map((item) => (
            <Grid item xs={12} key={item.items[0].product.perfilId}>
              <Box p={2}>
                <Typography variant="h5">
                  <Box pb={2}>{item.perfilName}</Box>
                </Typography>
              </Box>
              <CartDetails
                cartProductsData={item.items}
                changeItemQuantity={changeItemQuantity}
                removeItem={removeItem}
                initialValues={{ endereco: initialEndereco, nome: initialNome }}
                perfDelivery={item.items[0].product.delivery}
                perfEndereco={item.items[0].product.endereco}
                perfName={item.perfilName}
                perfId={item.items[0].product.perfilId}
                perfPrefix={item.perfilPrefix}
              />
            </Grid>
          ))}
          <Box p={2}>
            <Grid
              container
              alignItems="center"
              justify="flex-end"
              spacing={2}
            >
              <Grid item xs={12} sm="auto">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={removeAll}
                  fullWidth
                  size="large"
                >
                  Limpar Carrinho
                </Button>
              </Grid>

              <Grid item xs={12} sm="auto">
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={onContinuarComprando}
                  fullWidth
                  size="large"
                >
                  Continuar comprando
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </div>
  );
};

export default MyCartDetails;
