/* eslint-disable max-len */
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  Grid,
  InputAdornment,
  makeStyles,
  Popover,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import MotorcycleOutlinedIcon from '@material-ui/icons/MotorcycleOutlined';
import TimerIcon from '@material-ui/icons/Timer';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Alert } from '@material-ui/lab';
import * as yup from 'yup';
import { useForm, useField } from 'react-final-form-hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import hireDeliverService from './services/hireDeliverService';
import perfisService from './services/perfisService';

type HireDeliveryButtonProps = {
  orderId: number,
  perfilId: number,
  endAddress: string,
  position: { lat: number, lng: number },
};

const useStyles = makeStyles((theme) => ({
  buttonSize: {
    height: theme.spacing(5),
  },
  img: {
    objectFit: 'cover',
    borderRadius: 200,
  },
  imgPopover: {
    display: 'flex',
    width: theme.spacing(13),
    height: theme.spacing(13),
  },
  popoverBox: {
    maxWidth: theme.spacing(18),
  },
}));

yup.setLocale({
  mixed: {
    default: 'Este campo não é válido',
    required: 'O campo precisa estar preenchido',
  },
});

const schema = yup.object().shape({
  value: yup
    .number()
    .required(),
});

const HireDeliveryButton = ({
  orderId, perfilId, endAddress, position,
}:HireDeliveryButtonProps) => {
  const classes = useStyles();

  const [hireDeliveryData, setHireDelivery] = useState<any>({ status: undefined });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startAddress, setStartAddress] = useState('');
  const [snackBarSuccessHire, setSnackBarSuccessHire] = useState(false);
  const [snackBarDangerHire, setSnackBarDangerHire] = useState(false);
  const [snackBarSuccessDelete, setSnackBarSuccessDelete] = useState(false);
  const [snackBarDangerDelete, setSnackBarDangerDelete] = useState(false);
  const [touchedValue, setTouchedValue] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [deliverPerf, setDeliverPerf] = useState<any>({ nome: undefined });

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? 'simple-popover' : undefined;

  const loadStartAddress = async () => {
    const response = await perfisService.get(perfilId);
    setStartAddress(response.data.endereco);
  };

  const loadHireDeliveryData = async () => {
    const response = await hireDeliverService.getHireByOrderId(orderId);
    if (response.data?.data[0]) {
      setHireDelivery(response.data?.data[0]);
    }
    if (response.data?.data[0] === undefined) {
      setHireDelivery({ status: undefined });
    }
    if (response.data?.data[0]?.status === false) {
      setTimeout(() => {
        loadHireDeliveryData();
      }, 2000);
    }
  };

  const loadDeliveryPerfil = async () => {
    const response = await perfisService.get(hireDeliveryData.deliverId);
    if (response.data) {
      setDeliverPerf(response.data);
    }
  };

  useEffect(() => {
    loadHireDeliveryData();
    loadStartAddress();
    loadDeliveryPerfil();
  }, []);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    loadDeliveryPerfil();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleOpenConfirmCancel = () => {
    setConfirmCancel(true);
  };

  const handleCloseConfirmCancel = () => {
    setConfirmCancel(false);
  };

  const handleOpenSnackBarSuccessHire = () => {
    setSnackBarSuccessHire(true);
  };

  const handleCloseSnackBarSuccessHire = () => {
    setSnackBarSuccessHire(false);
  };

  const handleOpenSnackBarDangerHire = () => {
    setSnackBarDangerHire(true);
  };

  const handleCloseSnackBarDangerHire = () => {
    setSnackBarDangerHire(false);
  };

  const handleOpenSnackBarSuccessDelete = () => {
    setSnackBarSuccessDelete(true);
  };

  const handleCloseSnackBarSuccessDelete = () => {
    setSnackBarSuccessDelete(false);
  };

  const handleOpenSnackBarDangerDelete = () => {
    setSnackBarDangerDelete(true);
  };

  const handleCloseSnackBarDangerDelete = () => {
    setSnackBarDangerDelete(false);
  };

  const onSubmit = async (values: any) => {
    const params:any = values;
    params.contractorId = perfilId;
    params.status = false;
    params.ordersId = orderId;
    params.lat = position.lat;
    params.lng = position.lng;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    const response = await hireDeliverService.save(params);
    if (response.ok) {
      handleOpenSnackBarSuccessHire();
      handleClose();
      loadHireDeliveryData();
    } else {
      handleOpenSnackBarDangerHire();
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
    initialValues: {
      startAddress,
      endAddress,
    },
  });

  const startAddressInput = useField('startAddress', form);
  const endAddressInput = useField('endAddress', form);
  const valueInput = useField('value', form);

  const deleteHireDelivery = async () => {
    const response = await hireDeliverService.deleteHireDelivery(hireDeliveryData.id);
    if (response.ok) {
      setHireDelivery({ status: undefined });
      handleOpenSnackBarSuccessDelete();
      handleCloseConfirmCancel();
    } else {
      handleOpenSnackBarDangerDelete();
    }
  };

  const cancelHireDelivery = async () => {
    const status = await hireDeliverService.getHireByOrderId(orderId);
    if (status.data.data[0].status === false) {
      deleteHireDelivery();
    }
  };

  return (
    <>
      {hireDeliveryData.status === undefined && (
      <Button
        variant="contained"
        color="primary"
        startIcon={<MotorcycleOutlinedIcon />}
        size="small"
        fullWidth
        onClick={handleOpen}
      >
        Solicitar entregador
      </Button>
      )}
      {hireDeliveryData.status === false && (
        <ButtonGroup variant="contained" color="primary" fullWidth>
          <Button
            variant="contained"
            startIcon={<TimerIcon />}
            size="small"
            fullWidth
          >
            Aguardando
          </Button>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            size="small"
            fullWidth
            onClick={handleOpenConfirmCancel}
          >
            Cancelar
          </Button>
        </ButtonGroup>
      )}
      {hireDeliveryData.status === true && (
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircleOutlineIcon />}
            size="small"
            fullWidth
            aria-describedby={popoverId}
            onClick={handlePopoverOpen}
          >
            Aceito
          </Button>
          <Popover
            id={popoverId}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box p={2} className={classes.popoverBox}>
              <Grid container justify="center" spacing={1}>
                <Grid item xs="auto">
                  <div className={classes.imgPopover}>
                    <img
                      src={deliverPerf['picture.imgBase64'] || '/empty-profile.png'}
                      alt=""
                      className={classes.img}
                      height="100%"
                      width="100%"
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography color="textSecondary" align="center">
                        {deliverPerf.nome}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography color="textSecondary" align="center">
                        {deliverPerf.zap}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const win = window.open(`https://wa.me/55${deliverPerf.zap}`, '_blank');
                      win.focus();
                    }}
                  >
                    Conversar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Popover>
        </div>
      )}
      <Dialog onClose={handleCloseConfirmCancel} aria-labelledby="cancel-titulo-dialog" open={confirmCancel}>
        <Typography component="span" variant="h6" align="center" id="titulo-dialog">
          <Box pt={2} pl={2} pr={2} fontWeight="fontWeightBold">
            Você realmente quer cancelar o pedido?
          </Box>
        </Typography>
        <Box p={2}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6} md={4}>
              <Button color="primary" variant="contained" onClick={cancelHireDelivery}>Confirmar</Button>
            </Grid>
            <Grid item xs={6} md={4}>
              <Button color="secondary" variant="outlined" onClick={handleCloseConfirmCancel}>Cancelar</Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      <Dialog onClose={handleClose} aria-labelledby="titulo-dialog" open={dialogOpen}>
        <Typography component="span" variant="h6" align="center" id="titulo-dialog">
          <Box p={2} fontWeight="fontWeightBold">
            Solicitar entregador
          </Box>
        </Typography>
        <Box p={2}>
          <form onSubmit={handleSubmit}>
            <Grid container justify="center" spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...startAddressInput.input}
                  size="small"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">De:</InputAdornment>,
                  }}
                  fullWidth
                  color="primary"
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...endAddressInput.input}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Para:</InputAdornment>,
                  }}
                  color="primary"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...valueInput.input}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                  type="number"
                  placeholder="Valor da entrega"
                  size="small"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  error={touchedValue && valueInput.meta.invalid}
                  helperText={
                    touchedValue
                    && valueInput.meta.invalid
                    && valueInput.meta.error
                  }
                  onBlur={() => {
                    setTouchedValue(true);
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button onClick={handleClose} fullWidth variant="outlined" color="primary" className={classes.buttonSize}>Cancelar</Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button type="submit" disabled={pristine || submitting} fullWidth variant="contained" color="primary" className={classes.buttonSize}>Solicitar</Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Dialog>
      <Snackbar open={snackBarSuccessHire} autoHideDuration={6000} onClose={handleCloseSnackBarSuccessHire}>
        <Alert onClose={handleCloseSnackBarSuccessHire} severity="success">
          Seu pedido foi feito com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar open={snackBarDangerHire} autoHideDuration={6000} onClose={handleCloseSnackBarDangerHire}>
        <Alert onClose={handleCloseSnackBarDangerHire} severity="error">
          Ops... algo deu errado ao finalizar seu pedido.
        </Alert>
      </Snackbar>
      <Snackbar open={snackBarSuccessDelete} autoHideDuration={6000} onClose={handleCloseSnackBarSuccessDelete}>
        <Alert onClose={handleCloseSnackBarSuccessDelete} severity="success">
          Seu pedido foi cancelado com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar open={snackBarDangerDelete} autoHideDuration={6000} onClose={handleCloseSnackBarDangerDelete}>
        <Alert onClose={handleCloseSnackBarDangerDelete} severity="error">
          Ops... algo deu errado ao cancelar seu pedido.
        </Alert>
      </Snackbar>
    </>
  );
};

export default HireDeliveryButton;
