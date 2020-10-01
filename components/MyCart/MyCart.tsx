import { Button, Grid, makeStyles, Modal, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { formatNumberToMoneyWithSymbol } from "../../formatters";
import MyCartDetails from "../MyCartDetails/MyCartDetails";
import ProductCart from "../ProductCart/ProductCart";

export type MyCartProps = {
  cartProducts: Array<any>;
  totalValue: number;
  changeItemQuantity: () => void;
  removeItem: () => void;
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

const MyCart = ({ cartProducts, totalValue, changeItemQuantity, removeItem }: MyCartProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <Grid container>
      <Grid item xs={10}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" color="textPrimary">Meu carrinho:</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {cartProducts.map((item: any, index: number) => {
                return (
                  <Grid item xs={2} key={index}>
                    <ProductCart
                      quantity={item.quantity}
                      src={item.product["picture.imgBase64"]}
                      name={item.product.titulo}
                      id={item.product.id}
                      removeItem={removeItem}
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
          spacing={1}
        >
          <Grid item xs={12}>
            <Typography variant="h6" color="textPrimary">
              Total:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" color="primary">
              {formatNumberToMoneyWithSymbol(totalValue, "R$")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" variant="outlined" onClick={handleOpen}>
              Detalhes
            </Button>
            
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" variant="contained" onClick={handleOpen}>
              Pedir no zap
            </Button>
          </Grid>
        </Grid>
      </Grid>
     
    </Grid>

    <Modal open={open} onClose={handleClose}>
              <MyCartDetails cartProductsData={cartProducts} onContinuarComprando={handleClose} changeItemQuantity={changeItemQuantity} removeItem={removeItem}/>
      </Modal>
    </>
  );
};

export default MyCart;
