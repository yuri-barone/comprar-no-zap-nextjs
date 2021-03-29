/* eslint-disable max-len */
import {
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ShareIcon from '@material-ui/icons/Share';
import { Skeleton } from '@material-ui/lab';
import { formatNumberToMoneyWithSymbol } from '../../formatters';
import pictureService from '../services/pictureService';
import Claped from '../icons/Claped';
import Clap from '../icons/Clap';

export type ProductCardProps = {
  product: any;
  onAdd?: (item:any) => void;
  onNavigate?: (store:any) => void;
  toggleLike: (productId:number) => void;
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
  link: {
    cursor: 'pointer',
  },
});

function ProductCard({
  product, onAdd, onNavigate, toggleLike,
}: ProductCardProps) {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState<string | undefined>();

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

  const handleOnSeeProducts = () => {
    onNavigate({
      id: product.perfilId,
    });
  };

  useEffect(() => {
    getImage();
  }, []);

  const createProductCart = () => {
    const productCart:any = {};
    productCart.product = product;
    productCart.quantity = quantity;
    onAdd(productCart);
  };

  // eslint-disable-next-line consistent-return
  const shareProduct = async () => {
    const tryNavigator = (navigator as any);
    if (tryNavigator && tryNavigator.share) {
      const shareData = {
        title: 'Produto',
        text: product.title,
        url: `/produtos/${product.id}`,
      };
      try {
        await tryNavigator.share(shareData);
      } catch (error) {
        return error;
      }
    } else {
      const link = `/produtos/${product.id}`;
      const win = window.open(link, '_blank');
      win.focus();
    }
  };

  return (
    <Paper className={classes.root}>
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          { image ? (
            <img
              alt={product.titulo}
              src={image || '/empty-img.png'}
              className={classes.img}
              width="100%"
              height="200px"
            />
          ) : (
            <Skeleton animation="wave" variant="rect" width="100%" height={200} />
          )}
        </Grid>
        <Box pb={2} pl={2} pr={2} pt={1} className={classes.box}>
          <Grid container spacing={2} alignContent="space-between" style={{ height: '100%' }}>
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Grid item xs="auto">
                  <IconButton aria-label="share" onClick={shareProduct}>
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Grid>
                <Grid item xs="auto">
                  <IconButton aria-label="like" onClick={() => toggleLike(product.id)}>
                    {!product.liked && (
                      <Clap />
                    )}
                    {product.liked && (
                      <Claped />
                    )}
                  </IconButton>
                  {!!product.likecount && (
                  <Typography variant="caption" color="textSecondary">
                    {product.likecount}
                  </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box pt={1}>
                <Typography variant="h5">{product.titulo}</Typography>
                <br />
                <Typography color="textSecondary">{product.descricao}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="flex-end" spacing={2}>
                <Grid item xs={12}>
                  <Typography color="primary">{formatNumberToMoneyWithSymbol(product.valor, 'R$')}</Typography>
                  <Typography color="textSecondary">
                    {onNavigate && (
                    <Link color="textSecondary" onClick={handleOnSeeProducts} className={classes.link}>
                      {product.nome}
                    </Link>
                    )}
                    {!onNavigate && (
                      <>
                        {product.nome}
                      </>
                    )}
                  </Typography>
                  {!!product.distance && (
                  <Typography variant="caption" color="secondary">
                    A
                    {' '}
                    {product.distance}
                    km de você
                  </Typography>
                  )}
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
