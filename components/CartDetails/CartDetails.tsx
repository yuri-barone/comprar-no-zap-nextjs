import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useMemo, useState } from "react";
import ItemShowDetails from "../ItemShowDetails/ItemShowDetails";
import { green } from "@material-ui/core/colors";
import { formatNumberToMoneyWithSymbol } from "../../formatters";

const ButtonColor = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[600]),
    backgroundColor: green[600],
    "&:hover": {
      backgroundColor: green[800],
    },
  },
}))(Button);

export type CartDetailsProps = {
  cartProductsData: Array<any>;
  changeItemQuantity: () => void;
  removeItem: () => void;
};

const CartDetails = ({
  cartProductsData,
  changeItemQuantity,
  removeItem,
}: CartDetailsProps) => {
  const [entregar, setEntregar] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePaymentMethod = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  const totalValue = useMemo(() => {
    let total = 0;
    cartProductsData.forEach((item) => {
      total += item.product.valor * item.quantity;
    });
    return total;
  }, [cartProductsData]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          {cartProductsData.map((item, index) => {
            return (
              <Grid item xs="auto">
                <ItemShowDetails
                  src={item.product["picture.imgBase64"]}
                  quantity={item.quantity}
                  productValue={item.product.valor}
                  productName={item.product.titulo}
                  productId={item.product.id}
                  key={item.product.id}
                  changeItemQuantity={changeItemQuantity}
                  removeItem={removeItem}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs>
            <FormControlLabel
              control={<Checkbox color="primary" onChange={() => setEntregar(!entregar)} />}
              label="Entregar"
            />
            <Collapse in={entregar}>
              <TextField label="Endereço de entrega" fullWidth></TextField>
            </Collapse>
          </Grid>
          <Grid item xs="auto">
            <RadioGroup
              row
              name="payment"
              value={paymentMethod}
              onChange={handlePaymentMethod}
            >
              <FormControlLabel
                value="Cartão"
                control={<Radio />}
                label="Cartão"
                labelPlacement="end"
              />
              <FormControlLabel
                value="Dinheiro"
                control={<Radio />}
                label="Dinheiro"
                labelPlacement="end"
              />
            </RadioGroup>
            <Collapse in={paymentMethod === "Dinheiro"}>
              <TextField label="Troco para:" />
            </Collapse>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={6} sm={6}>
        <Typography variant="h6">
          Total: {formatNumberToMoneyWithSymbol(totalValue, "R$")}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6}>
        <Grid container justify="flex-end">
          <Grid item xs="auto">
            <ButtonColor variant="contained" color="primary">
              Pedir no zap
            </ButtonColor>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CartDetails;
