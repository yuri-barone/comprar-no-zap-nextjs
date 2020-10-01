import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import CartDetails from "../CartDetails/CartDetails";

export type MyCartDetailsProps = {
  cartProductsData: Array<any>;
  onContinuarComprando: () => void;
  changeItemQuantity: () => void;
  removeItem: () => void;
};

const useStyles = makeStyles({
  root: {
    height: '100vh',
    overflowY: 'auto',
  },
});
const MyCartDetails = ({
  cartProductsData,
  onContinuarComprando,
  changeItemQuantity,
  removeItem,
}: MyCartDetailsProps) => {
  const classes = useStyles();
  const [cartSellers, setCartSellers] = useState([]);
  const groupProductsBySeller = () => {
    let sellerProductsMap: any = {};
    cartProductsData.forEach((shoppItem: any) => {
      const sellerId = shoppItem.product.perfilId;
      sellerProductsMap[sellerId] = sellerProductsMap[sellerId] || {
        perfilName: shoppItem.product["perfil.nome"],
        zap: shoppItem.product["perfil.zap"],
        endereco: shoppItem.product["perfil.endereco"],
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
                    <Typography >Basta clicar no botão <Box component="span" fontWeight="fontWeightBold">Pedir no Zap</Box> que o seu pedido será enviado pelo WhatsApp</Typography>
                  </Grid>

                                  <Grid item xs="auto">
                    <Button color="primary" variant="contained" onClick={onContinuarComprando}>Continuar pedindo</Button>
                  </Grid>
                </Grid>
                </Box>
              </Paper>
            </Grid>
            {cartSellers.map((item) => {
              return (
                <Grid item xs={12}>
                  <Paper variant="outlined">
                    <Box p={2}>
                      <Typography variant="h5">
                        <Box pb={2}>{item.perfilName}</Box>
                      </Typography>

                      <CartDetails
                        cartProductsData={item.items}
                        changeItemQuantity={changeItemQuantity}
                        removeItem={removeItem}
                      />
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
<Grid item xs={12}>
             <Paper variant="outlined">
                 <Box p={2}>
                <Grid container alignItems="center" justify="flex-end" spacing={2}>                  
                <Grid item xs="auto">
                    <Button color="primary" variant="outlined" onClick={onContinuarComprando}>Limpar Carrinho</Button>
                  </Grid>

                  <Grid item xs="auto">
                    <Button color="primary" variant="contained" onClick={onContinuarComprando}>Fechar</Button>
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
