import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ShareIcon from '@material-ui/icons/Share';
import { formatNumberToMoneyWithSymbol } from '../../formatters';
import pictureService from '../services/pictureService';

export type ProductCardProps = {
  product: any;
  onAdd?: (item:any) => void
};

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  img: {
    objectFit: 'cover',
  },
  box: {
    height: 'calc(100% - 200px)',
  },
});

function ProductCard({ product, onAdd }: ProductCardProps) {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState('/empty-img.jpg');

  // eslint-disable-next-line consistent-return
  const getImage = async () => {
    try {
      const pictureResponse = await pictureService.get(product.pictureId);
      setImage(pictureResponse.data.imgBase64);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getImage();
    return () => {
      setImage('/empty-img.jpg');
    };
  }, []);

  const createProductCart = () => {
    const productCart:any = {};
    productCart.product = product;
    productCart.quantity = quantity;
    onAdd(productCart);
  };

  // eslint-disable-next-line consistent-return
  const shareProduct = async () => {
    const shareData = {
      title: 'Produto',
      text: product.title,
      url: `/produtos/${product.id}`,
    };
    try {
      await navigator.share(shareData);
    } catch (error) {
      const link = `/produtos/${product.id}`;
      const win = window.open(link, '_blank');
      win.focus();
    }
  };

  return (
    <Paper className={classes.root}>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <img
            alt={product.titulo}
            src={image}
            className={classes.img}
            width="100%"
            height="200px"
          />
        </Grid>
        <Box pb={2} pl={2} pr={2} pt={1} className={classes.box}>
          <Grid container spacing={2} alignContent="space-between" style={{ height: '100%' }}>
            <Grid item xs={12}>
              <IconButton aria-label="share" onClick={shareProduct}>
                <ShareIcon fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">{product.titulo}</Typography>
              <br />
              <Typography color="textSecondary">{product.descricao}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="flex-end" spacing={2}>
                <Grid item xs={12}>
                  <Typography color="primary">{formatNumberToMoneyWithSymbol(product.valor, 'R$')}</Typography>
                  <Typography color="textSecondary">{product.nome}</Typography>
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
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Paper>
  );
}

export default ProductCard;
