/* eslint-disable max-len */
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  Grid, IconButton, makeStyles, Modal, Paper, Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
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
    height: 36,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const AdProductShow = ({ product, onAdd }:AdProductShowProps) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState<string | undefined>();
  const [openDetails, setOpenDetails] = React.useState(false);

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

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  return (
    <>
      <Paper variant="outlined">
        <Grid container spacing={1}>
          <Grid item sm={4}>
            <a aria-hidden="true" onClick={handleOpenDetails} className={classes.link}>
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
            </a>
          </Grid>
          <Grid item sm={8}>
            <Box p={1}>
              <Grid container className={classes.content} alignItems="flex-end" spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body1" title={product.titulo} className={classes.titulo}>
                    <Box fontSize={13}>
                      {product.titulo}
                    </Box>
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs="auto">
                      <Typography color="textSecondary" className={classes.oldPrice}>
                        <Box fontSize={12}>
                          {formatNumberToMoneyWithSymbol(product.prodvalue, 'R$')}
                        </Box>
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <Typography variant="h6" color="primary">
                        <Box fontSize={13}>
                          {formatNumberToMoneyWithSymbol(product.valor, 'R$')}
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>

                </Grid>

                <Grid item xs>
                  <IconButton size="small" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : quantity)}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography component="span" color="textSecondary">
                    {quantity}
                  </Typography>

                  <IconButton size="small" onClick={() => setQuantity(quantity + 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Grid>
                <Grid item xs="auto">
                  <Button size="small" onClick={createProductCart} variant="contained" color="primary">
                    Adicionar
                  </Button>
                </Grid>

              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box p={2}>
        <Grid container>
          <Grid item xs={1}>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={openDetails}
              onClose={handleCloseDetails}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openDetails}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image || '/empty-img.png'}
                    title={product.titulo}
                  />
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="h5">{product.titulo}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography color="textSecondary">
                          {product.descricao}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1" color="primary">
                          {formatNumberToMoneyWithSymbol(product.valor, 'R$')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography color="textSecondary" variant="h6">
                          {product.nome}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Grid container spacing={2}>
                      <Grid item xs="auto">
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
                      <Grid item xs>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={createProductCart}
                          fullWidth
                        >
                          Adicionar ao carrinho
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              </Fade>
            </Modal>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdProductShow;
