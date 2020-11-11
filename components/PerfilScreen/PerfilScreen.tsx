import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import React, {
  useEffect, useRef, useState,
} from 'react';
import { useForm, useField } from 'react-final-form-hooks';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import * as yup from 'yup';
import Reward from 'react-rewards';
import ImageUpload from '../ImageUpload/ImageUpload';
import MaskedTextField from '../MaskedTextField';
import perfisService from '../services/perfisService';
import useSession from '../useSession';

yup.setLocale({
  mixed: {
    default: 'Não é válido',
    required: 'O campo precisa estar preenchido',
  },
  string: {
    // eslint-disable-next-line no-template-curly-in-string
    min: 'O mínimo de caracteres é ${min}',
  },
});

const schema = yup.object().shape({
  nome: yup.string().required(),
  zap: yup.string().min(10).required(),
  endereco: yup.string().min(3).required(),
});

export type PerfilScreenProps = {
  src?: string;
  nome: string;
  zap: string;
  endereco: string;
  id: number;
  seller: boolean;
  searchNewPerfil: () => void;
  userId: number;
  delivery: boolean;
  palavrasChaves: string;
  domain: string;
};

const buildDomain = (value: string) => {
  if (!value) {
    return value;
  }

  const formatedDomain = value.toLowerCase().normalize('NFD').replace(/[^a-z0-9&\-\s]/g, '')
    .replace(/\s/g, '-')
    .replace(/&/g, '-e-');
  return formatedDomain;
};

const buildNome = (value: string) => {
  if (!value) {
    return value;
  }
  const formatedNome = value.normalize('NFD').replace(/[^\u0300-\u036fA-z0-9&\s]/g, '')
    .trim();
  return formatedNome;
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    minHeight: '100%',
    display: 'flex',
  },
  avatarSize: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
  link: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  fullWidth: {
    width: '100%',
  },
  clickable: {
    cursor: 'pointer',
  },
}));

function PerfilScreen({
  src,
  nome,
  zap,
  endereco,
  id,
  searchNewPerfil,
  seller,
  delivery,
  userId,
  palavrasChaves,
  domain,
}: PerfilScreenProps) {
  const [img64, setImg64] = useState<any>(src);
  const [openDanger, setOpenDanger] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [zapIsValid, setZapIsValid] = useState(true);
  const [touchedZap, setTouchedZap] = useState<boolean>(false);
  const [touchedName, setTouchedName] = useState<boolean>(false);
  const [dominioIsValid, setDominioIsValid] = useState<boolean>(true);

  const refReward = useRef(null);
  const refRewardAfterSuccess = useRef(null);

  useEffect(() => {
    const rewarded = localStorage.getItem('PDZReward');
    if (!rewarded) {
      refReward.current.rewardMe();
      localStorage.setItem('PDZReward', 'Yes');
    }
  }, []);

  const session = useSession(true);
  const openSnackBarDanger = () => {
    setOpenDanger(true);
  };
  const handleDangerClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenDanger(false);
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

  const dominioMutator = (fieldNameOrigin: string, state:any, { changeValue }:any) => {
    if (fieldNameOrigin[0] === 'nome') {
      const value = state.formState.values[fieldNameOrigin];
      const valueName = buildNome(value);
      const dominio = buildDomain(valueName);
      changeValue(state, 'nome', () => valueName);
      changeValue(state, 'domain', () => dominio);
    }
    const valueName = state.formState.values[fieldNameOrigin];
    const dominio = buildDomain(valueName);
    changeValue(state, 'domain', () => dominio);
  };

  const onSubmit = async (values: any) => {
    const params:any = values;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    session;
    params.imgBase64 = img64;
    params.userId = userId;
    const response = await perfisService.edit(id, params);
    if (response.ok) {
      searchNewPerfil();
      openSnackBarSuccess();
      if (params.seller === true) {
        setTimeout(() => {
          refRewardAfterSuccess.current.rewardMe();
        }, 500);
      }
    } else {
      openSnackBarDanger();
    }
  };

  const processAsyncValidate = (errors:any) => {
    if (!dominioIsValid && zapIsValid) {
      return { ...errors, domain: 'Este domínio já está sendo utilizado' };
    }
    if (!zapIsValid && dominioIsValid) {
      return { ...errors, zap: 'Este zap já esta em uso' };
    }
    if (!dominioIsValid && !zapIsValid) {
      return { ...errors, zap: 'Este zap já esta em uso', domain: 'Este domínio já está sendo utilizado' };
    }
    return errors;
  };

  // eslint-disable-next-line consistent-return
  const validate = (values: any): any => {
    try {
      schema.validateSync(values, { abortEarly: false });
      return processAsyncValidate({});
    } catch (errors) {
      let formErrors: any = {};
      errors.inner.forEach((erro: ValidationErrors) => {
        formErrors[erro.path] = erro.message;
      });
      formErrors = processAsyncValidate(formErrors);
      return formErrors;
    }
  };

  const classes = useStyles();
  const {
    form, handleSubmit, pristine, submitting,
  } = useForm({
    onSubmit,
    validate,
    initialValues: {
      nome,
      zap,
      endereco,
      seller,
      delivery,
      palavrasChaves,
      domain,
    },
    mutators: { dominioMutator },
  });
  const nomeInput = useField('nome', form);
  const zapInput = useField('zap', form);
  const enderecoInput = useField('endereco', form);
  const sellerBox = useField('seller', form);
  const deliveryBox = useField('delivery', form);
  const palavrasChavesInput = useField('palavrasChaves', form);
  const domainInput = useField('domain', form);

  const handleImage = (base64: any) => {
    setImg64(base64);
  };

  const validateZap = async (value:string) => {
    if (value) {
      const response = await perfisService.checkZap(value);
      if (response.data.length === 0) {
        setZapIsValid(true);
        return;
      }
      if (response.data[0].id === id) {
        setZapIsValid(true);
        return;
      }
      setZapIsValid(false);
    }
  };

  const validateDomain = async (value:string) => {
    const dominio = buildDomain(value);
    if (dominio) {
      const response = await perfisService.checkDomain(dominio);
      if (response.data.length === 0) {
        setDominioIsValid(true);
        return;
      }
      if (response.data[0].id === id) {
        setDominioIsValid(true);
        return;
      }
      setDominioIsValid(false);
    }
  };

  const touchName = () => {
    setTouchedName(true);
  };

  const touchZap = () => {
    setTouchedZap(true);
  };

  const showCatalogo = () => {
    const link = `/lojas/${domain}`;
    const win = window.open(link, '_blank');
    win.focus();
  };

  const copyLink = () => {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/lojas/${domain}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs />
        <Grid item xs="auto">
          <Box p={2}>
            <Typography className={classes.link}>
              <Link href="/produtos" color="inherit">
                Meus produtos
              </Link>
              <Link href="/" color="inherit">
                Ir para página inicial
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.root}>
        <Box p={2} className={classes.fullWidth}>

          <Grid container justify="center" spacing={2} alignItems="center">
            <Container>
              <Grid item xs={12}>
                <Reward
                  ref={refRewardAfterSuccess}
                  type="confetti"
                  config={{
                    lifetime: 150,
                    angle: 90,
                    decay: 0.91,
                    spread: 50,
                    startVelocity: 35,
                    elementCount: 125,
                    elementSize: 7,
                  }}
                />
              </Grid>
              {seller && (
              <Grid item xs={12}>
                <Alert severity="info" icon={<MenuBookIcon />}>
                  <Reward
                    ref={refReward}
                    type="confetti"
                    config={{
                      lifetime: 150,
                      angle: 90,
                      decay: 0.91,
                      spread: 50,
                      startVelocity: 35,
                      elementCount: 125,
                      elementSize: 7,
                    }}
                  />
                  <AlertTitle>Seu Catálogo</AlertTitle>
                  Parabéns agora seu estabelecimento tem um catálogo na internet. Clique
                  {' '}
                  <Link onClick={showCatalogo} className={classes.clickable}>
                    <strong>aqui</strong>
                  </Link>
                  {' '}
                  para ir ao seu catálogo.
                  {' '}
                  <br />
                  {window.location.origin}
                  /lojas/
                  {domain}
                  <IconButton title="Copiar link" color="inherit" component="span" size="small" onClick={copyLink}>
                    <FileCopyIcon fontSize="small" />
                  </IconButton>
                </Alert>
              </Grid>
              )}
            </Container>
            <Grid item xs="auto" md={3} sm={3} lg={2}>
              <ImageUpload
                onChangeImage={handleImage}
                rounded
                defaultImage={src}
              />
            </Grid>
            <Grid item xs={12} md={9} sm={10}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Meus Dados</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...nomeInput.input}
                      label="Nome"
                      variant="outlined"
                      fullWidth
                      id="nome"
                      error={touchedName && nomeInput.meta.invalid}
                      helperText={
                        touchedName
                        && nomeInput.meta.invalid
                        && nomeInput.meta.error
                      }
                      onBlur={() => {
                        form.mutators.dominioMutator('nome');
                        validateDomain(nomeInput.input.value);
                        touchName();
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...domainInput.input}
                      label="Dominio"
                      onBlur={() => {
                        form.mutators.dominioMutator('domain');
                        validateDomain(domainInput.input.value);
                      }}
                      variant="outlined"
                      fullWidth
                      id="domain"
                      error={!dominioIsValid}
                      helperText={
                        !dominioIsValid
                        && domainInput.meta.invalid
                        && domainInput.meta.error
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MaskedTextField
                      id="zap"
                      label="Whatsapp"
                      field={zapInput}
                      validateZap={validateZap}
                      isTouched={touchedZap}
                      touch={touchZap}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...enderecoInput.input}
                      id="endereco"
                      label="Endereço"
                      variant="outlined"
                      fullWidth
                      error={
                        enderecoInput.meta.touched && enderecoInput.meta.invalid
                      }
                      helperText={
                        enderecoInput.meta.touched
                        && enderecoInput.meta.invalid
                        && enderecoInput.meta.error
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...palavrasChavesInput.input}
                      id="palavrasChaves"
                      label="Palavras Chaves"
                      variant="outlined"
                      fullWidth
                      error={
                        palavrasChavesInput.meta.touched && palavrasChavesInput.meta.invalid
                      }
                      helperText={
                        palavrasChavesInput.meta.touched
                        && palavrasChavesInput.meta.invalid
                        && palavrasChavesInput.meta.error
                      }
                    />
                    <Typography variant="caption">
                      Coloque aqui o nome de alguns produtos ou serviços que
                      você trabalha, assim as pessoas te encontrarão mais
                      fácil.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container justify="flex-end" spacing={2}>
                  <Grid item xs="auto">
                    <FormControlLabel control={<Checkbox defaultChecked={seller} {...sellerBox.input} />} label="Quero vender" />
                  </Grid>
                  <Grid item xs="auto">
                    <Collapse in={sellerBox.input.value === true}>
                      <FormControlLabel control={<Checkbox defaultChecked={delivery} {...deliveryBox.input} />} label="Faço entregas" />
                    </Collapse>
                  </Grid>
                  <Grid item xs="auto">
                    <Button variant="contained" color="secondary" type="submit" disabled={pristine || submitting}>
                      Salvar
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Box>
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
            Não foi possível atualizar seu perfil.
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSuccess}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
        >
          <Alert severity="success">
            Perfil atualizado com sucesso.
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default PerfilScreen;
