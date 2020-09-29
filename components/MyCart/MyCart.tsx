import {
  Avatar,
  Badge,
  Button,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import ProductCart from "../ProductCart/ProductCart";

export type MyCartProps = {
  cartProducts: Array<any>
};

const useStyles = makeStyles((theme) => ({
  avatarSize: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
  containerFullHeight: {
    height: "100%",
  },
}));

const MyCart = ({cartProducts}:MyCartProps) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={10}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5">Meu carrinho</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              
              {cartProducts.map((item:any, index:number) => {
                return (
                    <Grid item xs="auto" key={index}>
                    <ProductCart 
                    quantity={item.quantity}
                    src={item.product.src}
                    name={item.product.name}
                    />
                     </Grid>
                );
                })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Grid
          container
          alignContent="center"
          className={classes.containerFullHeight}
        >
          <Grid item xs={12}>
            <Typography variant="h6">Total</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color="primary">
              R$250,00
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" variant="contained">
              Pedir no zap
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MyCart;
