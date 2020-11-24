import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import red from '@material-ui/core/colors/red';
import ShareIcon from '@material-ui/icons/Share';
import { formatNumberToMoneyWithSymbol } from '../../formatters';
import productsService from '../services/productsService';
import ProductRegister from '../ProductRegister/ProductRegister';
import pictureService from '../services/pictureService';

export type ProductCardProps = {
  product: any;
  onDelete: () => void;
  onDeleteSuccess: () => void;
  onDeleteError: () => void;
  onEditError: () => void;
  onEditSuccess: () => void;
};
const imgHeight = 176;
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    height: `calc(100% - ${imgHeight + theme.spacing(4)}px)`,
  },
  atEnd: {
    alignSelf: 'flex-end',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },
  imgDiv: {
    height: imgHeight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  imgRoot: {
    position: 'absolute',
    objectFit: 'cover',
  },
  hideName: {
    maxWidth: theme.spacing(10),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: 'black',

  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}))(Button);

function ProductCard({
  product,
  onDelete,
  onDeleteSuccess,
  onDeleteError,
  onEditError,
  onEditSuccess,
}: ProductCardProps) {
  const classes = useStyles();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [image, setImage] = useState('/empty-img.png');

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
      setImage('/empty-img.png');
    };
  }, []);

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const deleteProduct = async () => {
    const response = await productsService.deleteProduct(product.id);
    if (response.ok) {
      handleCloseDelete();
      onDeleteSuccess();
      onDelete();
    } else {
      onDeleteError();
      handleCloseDelete();
    }
  };

  const saveEditProduct = async (values: any) => {
    const response = await productsService.edit(product.id, values);
    const toChange:any = product;
    if (response.ok) {
      setIsEditing(false);
      toChange.titulo = response.data.titulo;
      const pictureResponse = await pictureService.get(response.data.pictureId);
      setImage(pictureResponse.data.imgBase64);
      toChange.descricao = response.data.descricao;
      toChange.valor = response.data.valor;
      onEditSuccess();
    } else {
      onEditError();
    }
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

  if (isEditing) {
    return (
      <ProductRegister
        defaultImage={image}
        onSave={saveEditProduct}
        initialValues={product}
        uploaderKey={product.id}
        onCancel={() => setIsEditing(false)}
      />
    );
  }
  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.imgDiv}>
          <img
            src={image || '/empty-img.png'}
            alt={product.titulo}
            height="100%"
            width="100%"
            className={classes.imgRoot}
          />
        </div>
        <Box p={2} className={classes.content}>
          <Grid container alignContent="space-between" className={classes.root}>
            <Grid item xs={12}>
              <IconButton aria-label="share" onClick={shareProduct}>
                <ShareIcon fontSize="small" />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5">{product.titulo}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">
                    {product.descricao}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="flex-end">
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="caption">
                    Vendido por
                    {' '}
                    {product.nome}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="primary">
                    {formatNumberToMoneyWithSymbol(product.valor, 'R$')}
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleOpenDelete}
                  >
                    Deletar
                  </Button>
                  {' '}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Box p={2}>
        <Grid container>
          <Grid item xs={1}>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={openDelete}
              onClose={handleCloseDelete}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openDelete}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image || '/empty-img.png'}
                    title={product.titulo}
                  />
                  <CardContent>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h5" className={classes.hideName} noWrap>{product.titulo}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography color="textSecondary" className={classes.hideName} noWrap>
                          {product.descricao}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" color="primary">
                          {formatNumberToMoneyWithSymbol(product.valor, 'R$')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography color="textSecondary" variant="h6">
                          {product['perfil.nome']}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <ColorButton
                          variant="contained"
                          fullWidth
                          onClick={deleteProduct}
                        >
                          Deletar
                        </ColorButton>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCloseDelete}
                          fullWidth
                        >
                          Cancelar
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
}

export default ProductCard;
