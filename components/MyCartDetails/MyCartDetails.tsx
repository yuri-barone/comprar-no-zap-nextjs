import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  FormControlLabel,
  Grid,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  withStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import ItemShowDetails from "../ItemShowDetails/ItemShowDetails";
import { green } from "@material-ui/core/colors";

export type MyCartDetailsProps = {
  cartProductsData: Array<any>;
  onContinuarComprando: () => void;
};

const ButtonColor = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(green[600]),
    backgroundColor: green[600],
    "&:hover": {
      backgroundColor: green[800],
    },
  },
}))(Button);

const useStyles = makeStyles({
  paperWidth: {
    position:"absolute",
    top:0,
    left:0,
    right:0,
    bottom:0,
  },
});
const MyCartDetails = ({
  cartProductsData,
  onContinuarComprando,
}: MyCartDetailsProps) => {
  const classes = useStyles();
  const [entregar, setEntregar] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")

  const handleEntregar = () => {
    if (entregar === true) {
      setEntregar(false)
    } else {
    setEntregar(true)
  }
  }
  const handlePaymentMethod = (e:any) => {
    setPaymentMethod(e.target.value);
  }

  return (
    
      <Paper className={classes.paperWidth}>
        <Box p={2}>
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  
                    {cartProductsData.map((item, index) => {
                      return (
                        <Grid item xs={12}>
                        <ItemShowDetails
                          src={item.product.src}
                          quantity={item.quantity}
                          productValue={item.product.valor}
                          productName={item.product.name}
                          key={index}
                        />
                        </Grid>
                      );
                    })}
                  
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2} justify="flex-end">
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={<Checkbox color="primary" onChange={handleEntregar}/>}
                          label="Entregar"
                        />
                        <Collapse in={entregar} >
                        <TextField
                          label="Endereço de entrega"
                          fullWidth
                        ></TextField>
                        </Collapse>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={12}>
                        <RadioGroup row name="payment" value={paymentMethod} onChange={handlePaymentMethod}>
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
                        <Collapse in={paymentMethod === "Dinheiro"} >
                        <TextField label="Troco para:"  />
                        </Collapse>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justify="flex-end" spacing={2}>
                      <Grid item xs="auto">
                        <Button
                          variant="contained"
                          color="default"
                          onClick={onContinuarComprando}
                        >
                          Continuar Comprando
                        </Button>
                      </Grid>
                      <Grid item xs="auto">
                        <ButtonColor variant="contained" color="primary">
                          Pedir no zap
                        </ButtonColor>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            </Container>
        </Box>
      </Paper>
  );
};

export default MyCartDetails;
