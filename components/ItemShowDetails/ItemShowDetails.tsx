import { Grid, IconButton, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  imgSize: {
    height: 50,
    width: 50,
  },
  containerMaxHeight: {
    height: "100%",
  },
});

export type ItemShowDetailsProps = {
  src?: string;
  quantity: number;
  productValue: number;
  productName: string;
};

const ItemShowDetails = ({
  src,
  quantity,
  productValue,
  productName,
}: ItemShowDetailsProps) => {
  const classes = useStyles();
  const [productQuantity, setProductQuantity] = useState(quantity);
  const [totalValue, setTotalValue] = useState<number>();

 useEffect(() => {
     calcTotalValue()
 }, [productQuantity]);

  const addQuantity = () => {
    const finalQuantity = productQuantity + 1;
    setProductQuantity(finalQuantity);
  };
  const removeQuantity = () => {
    const finalQuantity = productQuantity - 1;
    if (finalQuantity < 1) {
      return;
    }
    setProductQuantity(finalQuantity);
  };

  const calcTotalValue = () => {
    const total = productValue * productQuantity;
    setTotalValue(total)
  };

  return (
    <Grid container alignItems="center">
      <Grid item xs={2}>
        <img alt="" src={src} className={classes.imgSize}></img>
      </Grid>
      <Grid item xs={6}>
        <Grid
          container
          alignItems="center"
          className={classes.containerMaxHeight}
        >
          <Grid item xs={12}>
            <Typography variant="h6">{productName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary">R${productValue}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <IconButton onClick={removeQuantity}>
          <RemoveIcon fontSize="small"></RemoveIcon>
        </IconButton>
        <Typography component="span" color="textSecondary">
          {productQuantity}
        </Typography>
        <IconButton onClick={addQuantity}>
          <AddIcon fontSize="small"></AddIcon>
        </IconButton>
      </Grid>
      <Grid item xs={1}>
          <IconButton>
                <DeleteIcon></DeleteIcon>
          </IconButton>
      </Grid>
      <Grid item xs={1}>
        <Typography color="textSecondary" variant="h6">R${totalValue}</Typography>
      </Grid>
    </Grid>
  );
};

ItemShowDetails.defaultProps = {
  src:
    "https://t1.rg.ltmcdn.com/pt/images/3/1/3/hamburguer_de_frango_com_legumes_7313_orig.jpg",
  quantity: 5,
  productValue: 550,
  productName: "Hamburguer de frango",
};

export default ItemShowDetails;
