import {
  Box,
  Button,
  Grid, IconButton, makeStyles, Paper, Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import pictureService from './services/pictureService';
import { formatNumberToMoneyWithSymbol } from '../formatters';

export type AdProductShowProps = {
  product: any;
  onAdd?: (item:any) => void
};

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
    flex: '1 0 auto',
  },
  img: {
    objectFit: 'cover',
    display: 'block',
  },
  link: {
    cursor: 'pointer',
  },
  oldPrice: {
    textDecoration: 'line-through',
    textDecorationColor: theme.palette.text.secondary,
  },
  cover: {
    width: 200,
  },
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingRight: theme.spacing(2),
  },
  content: {
    flex: '1 0 auto',
  },
  titulo: {
    height: 45,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const AdProductShow = ({ product, onAdd }:AdProductShowProps) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState<string | undefined>();

  const createProductCart = () => {
    const productCart:any = {};
    productCart.product = product;
    productCart.quantity = quantity;
    onAdd(productCart);
  };

  // eslint-disable-next-line consistent-return
  const getImage = async () => {
    try {
      const pictureResponse = await pictureService.get(product.pictureId);
      setImage(pictureResponse.data.imgBase64);
      if (!pictureResponse.data.imgBase64) {
        setImage('/empty-img.png');
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <Paper variant="outlined">

      <Grid container spacing={1}>
        <Grid item sm={4} xs={12}>
          {image ? (
            <img
              alt={product.titulo}
              src={image || '/empty-img.png'}
              className={classes.img}
              width="100%"
              height="100%"
            />
          ) : (
            <Skeleton animation="wave" variant="rect" width="100%" height="100%" />
          )}

        </Grid>

        <Grid item sm={8} xs={12}>
          <Box p={1}>
            <Grid container className={classes.content} alignItems="flex-end" spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1" title={product.titulo} className={classes.titulo}>
                  {product.titulo}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs="auto">

                    <Typography color="textSecondary" className={classes.oldPrice}>
                      {formatNumberToMoneyWithSymbol(product.prodvalue, 'R$')}
                    </Typography>
                  </Grid>
                  <Grid item xs="auto">
                    <Typography variant="h6" color="primary">
                      {formatNumberToMoneyWithSymbol(product.valor, 'R$')}
                    </Typography>
                  </Grid>
                </Grid>

              </Grid>

              <Grid item xs>
                <IconButton onClick={() => setQuantity(quantity > 1 ? quantity - 1 : quantity)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography component="span" color="textSecondary">
                  {quantity}
                </Typography>

                <IconButton onClick={() => setQuantity(quantity + 1)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Grid>
              <Grid item xs="auto">
                <Button onClick={createProductCart} variant="contained" color="primary">
                  Adicionar
                </Button>
              </Grid>

            </Grid>
          </Box>
        </Grid>
      </Grid>

    </Paper>
  );
};

export default AdProductShow;
