import {
  Box,
  Button,
  Container,
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
};

const useStyles = makeStyles({
  root: {
    height: '100vh',
    overflowY: 'auto',
    paddingBottom: '25px',
  },
});
const MyCartDetails = ({
  cartProductsData,
  onContinuarComprando,
  changeItemQuantity,
  removeItem,
  removeAll,
  initialEndereco,

}: MyCartDetailsProps) => {
  const classes = useStyles();
  const [cartSellers, setCartSellers] = useState([]);
  const groupProductsBySeller = () => {
    const sellerProductsMap: any = {};
    cartProductsData.forEach((shoppItem: any) => {
      const sellerId = shoppItem.product.perfilId;
      sellerProductsMap[sellerId] = sellerProductsMap[sellerId] || {
        perfilName: shoppItem.product.nome,
        zap: shoppItem.product.zap,
        endereco: shoppItem.product.endereco,
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
      <Box p={2}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                      <Typography variant="h5">Meu pedido</Typography>
                      <Typography>
                        Basta clicar no botão
                        {' '}
                        <Box component="span" fontWeight="fontWeightBold">
                          Pedir no Zap
                        </Box>
                        {' '}
                        que o seu pedido será enviado pelo WhatsApp
                      </Typography>
                    </Grid>

                    <Grid item xs="auto">
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={onContinuarComprando}
                      >
                        Continuar pedindo
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
            {cartSellers.map((item) => (
              <Grid item xs={12} key={item.perfilId}>
                <Paper variant="outlined">
                  <Box p={2}>
                    <Typography variant="h5">
                      <Box pb={2}>{item.perfilName}</Box>
                    </Typography>
                  </Box>
                  <CartDetails
                    cartProductsData={item.items}
                    changeItemQuantity={changeItemQuantity}
                    removeItem={removeItem}
                    initialValues={{ endereco: initialEndereco }}
                  />
                </Paper>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-end"
                    spacing={2}
                  >
                    <Grid item xs="auto">
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={removeAll}
                      >
                        Limpar Carrinho
                      </Button>
                    </Grid>

                    <Grid item xs="auto">
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={onContinuarComprando}
                      >
                        Fechar
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default MyCartDetails;
