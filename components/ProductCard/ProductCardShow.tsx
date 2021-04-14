/* eslint-disable max-len */
/* eslint-disable no-template-curly-in-string */
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Fade,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Modal,
  Paper,
  Snackbar,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import red from '@material-ui/core/colors/red';
import ShareIcon from '@material-ui/icons/Share';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import * as yup from 'yup';
import { useForm, useField } from 'react-final-form-hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import { Alert } from '@material-ui/lab';
import { formatNumberToMoneyWithSymbol } from '../../formatters';
import productsService from '../services/productsService';
import ProductRegister from '../ProductRegister/ProductRegister';
import pictureService from '../services/pictureService';
import promotionsService from '../services/promotionsService';
import Clap from '../icons/Clap';

export type ProductCardProps = {
  product: any;
  onDelete: () => void;
  onDeleteSuccess: () => void;
  onDeleteError: () => void;
  onEditError: () => void;
  onEditSuccess: () => void;
};

yup.setLocale({
  mixed: {
    default: 'Não é válido',
    required: 'O campo precisa estar preenchido',
  },
  string: {
    min: 'O mínimo de caracteres é ${min}',
    max: 'O valor máximo de caracteres é ${max}',
  },
  number: {
    max: 'A promoção tem que ter pelo menos 5% de desconto (Valor menor ou igual a R$${max})',
    positive: 'O valor precisa ser positivo',
  },
});

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
  cardPromote: {
    [theme.breakpoints.down('sm')]: {
      height: '100%',
      overflowY: 'auto',
      width: '100%',
    },
    maxWidth: '480px',
  },
  hideName: {
    maxWidth: theme.spacing(25),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: 'black',
  },
  buttonProgress: {
    color: theme.palette.primary.light,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  iconColor: {
    color: theme.palette.primary.main,
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
  const [openPromote, setOpenPromote] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openDanger, setOpenDanger] = useState(false);
  const [image, setImage] = useState('/empty-img.png');

  const openSnackBarDanger = () => {
    setOpenDanger(true);
  };

  const handleDangerClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenDanger(false);
  };

  const getMinData = () => {
    const dtToday = new Date();
    const month = dtToday.getMonth() + 1;
    const day = dtToday.getDate();
    const year = dtToday.getFullYear();
    const maxDate = `${year}-${month}-${day}`;
    return maxDate;
  };

  const getFormatedData = (date:any) => new Date(date).toLocaleDateString();

  const schema = yup.object().shape({
    valor: yup
      .number()
      .typeError('Valor precisa ser um número')
      .positive()
      .max((product.valor - (5 * product.valor) / 100))
      .required(),
    data: yup
      .date()
      .min(getMinData(), `A promoção só pode ser feita para dias posteriores ou iguais a ${getFormatedData(getMinData())}`)
      .required(),
  });

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

  const handleOpenPromote = () => {
    setOpenPromote(true);
  };

  const handleClosePromote = () => {
    setOpenPromote(false);
  };

  const openSnackBarSuccess = () => {
    setOpenSuccess(true);
  };
  const handleSuccessClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const onSubmit = async (values:any) => {
    const val = {
      ...values, data: `${values.data}T03:00:00.000Z`, productId: product.id, status: false,
    };
    const res = await promotionsService.createPromotion(val);
    if (res.ok) {
      setOpenPromote(false);
      openSnackBarSuccess();
      const link = `https://api.whatsapp.com/send?phone=5544997737167&text=Ol%C3%A1%20estou%20querendo%20promover%20o%20meu%20produto%20voc%C3%AA%20pode%20aprovar%20para%20mim%3F%20O%20n%C3%BAmero%20da%20promo%C3%A7%C3%A3o%20%C3%A9%20${res.data.id}`;
      const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1
      && navigator.userAgent
      && navigator.userAgent.indexOf('CriOS') === -1
      && navigator.userAgent.indexOf('FxiOS') === -1;
      if (isSafari) {
        window.location.assign(link);
      } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.onclick = () => {
          window.open(link);
        };
        a.click();
        document.body.removeChild(a);
      }
    }
    if (!res.ok) {
      openSnackBarDanger();
    }
  };

  // eslint-disable-next-line consistent-return
  const validate = (values: any): any => {
    try {
      schema.validateSync(values, { abortEarly: false });
    } catch (errors) {
      const formErrors: any = {};
      errors.inner.forEach((erro: ValidationErrors) => {
        formErrors[erro.path] = erro.message;
      });
      return formErrors;
    }
  };

  const {
    form, handleSubmit, pristine, submitting,
  } = useForm({
    onSubmit, // the function to call with your form values upon valid submit
    validate, // a record-level validation function to check all form values
  });

  const valor = useField('valor', form);
  const data = useField('data', form);

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
        pauseInput
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
            {product.paused && (
            <Grid item xs={12}>
              <Typography color="textSecondary" variant="h5" align="center">
                Produto pausado!
              </Typography>
            </Grid>
            )}
            <Grid item xs={12}>
              <Grid container justify="space-between">
                <Grid item xs="auto">
                  <IconButton aria-label="share" onClick={shareProduct}>
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Grid>
                <Grid item xs="auto">
                  <Typography component="span" color="primary">
                    <Clap />
                    {' '}
                    {product.likecount}
                  </Typography>
                </Grid>
              </Grid>
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
              <Grid container justify="flex-end" alignItems="center" spacing={1}>
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
                <Grid item xs>
                  <Grid container justify="flex-start">
                    <Grid item xs="auto">
                      <IconButton onClick={handleOpenDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleOpenPromote}
                  >
                    Promover
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
          <Grid item xs={12}>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={openPromote}
              onClose={handleClosePromote}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openPromote}>
                <Card className={classes.cardPromote}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image || '/empty-img.png'}
                    title={product.titulo}
                  />
                  <form onSubmit={handleSubmit}>
                    <CardContent>
                      <Grid container spacing={2}>
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
                        <Grid item xs={12} sm={7}>
                          <TextField
                            {...valor.input}
                            id="valor"
                            label="Valor do produto em promoção"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">R$</InputAdornment>
                              ),
                            }}
                            type="number"
                            variant="outlined"
                            error={valor.meta.touched && valor.meta.invalid}
                            helperText={
                            valor.meta.touched
                            && valor.meta.invalid
                            && valor.meta.error
                          }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            {...data.input}
                            id="date"
                            label="Data da promoção"
                            type="date"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={data.meta.touched && data.meta.invalid}
                            helperText={
                                  data.meta.touched
                                  && data.meta.invalid
                                  && data.meta.error
                                }
                            fullWidth
                          />
                        </Grid>
                        {data.input.value && (
                          <Grid item xs={12}>
                            <Alert severity="info" role="alert">
                              <Typography>
                                Este é  um
                                {' '}
                                <Box fontWeight="fontWeightBold" component="span">
                                  anúncio relâmpago
                                </Box>
                                {' '}
                                e estará disponível por
                                {' '}
                                <Box fontWeight="fontWeightBold" component="span">
                                  24H
                                </Box>
                                {' '}
                                no dia
                                {' '}
                                <Box fontWeight="fontWeightBold" component="span">
                                  {getFormatedData(`${data.input.value}T03:00:00.000Z`)}
                                </Box>
                              </Typography>
                            </Alert>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClosePromote}
                            fullWidth
                          >
                            Cancelar
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <div className={classes.wrapper}>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              disabled={pristine || submitting}
                              type="submit"
                            >
                              Promover
                            </Button>
                            {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                          </div>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </form>
                </Card>
              </Fade>
            </Modal>
          </Grid>
        </Grid>
      </Box>
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
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert severity="info">
          Promoção enviada para análise
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openDanger}
        autoHideDuration={6000}
        onClose={handleDangerClose}
      >
        <Alert severity="error">
          Sua promoção não pode ser finalizada tente novamente mais tarde
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductCard;
