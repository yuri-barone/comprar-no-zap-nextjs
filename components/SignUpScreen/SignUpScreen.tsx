/* eslint-disable max-len */
/* eslint-disable no-template-curly-in-string */
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm, useField } from 'react-final-form-hooks';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import * as yup from 'yup';
import ImageUpload from '../ImageUpload/ImageUpload';
import MaskedTextField from '../MaskedTextField';
import perfisService from '../services/perfisService';
import usersService from '../services/usersService';
import { keepSession } from '../useSession';

const searchOptions = {
  componentRestrictions: { country: ['br'] },
};

const buildDomain = (value: string) => {
  if (!value) {
    return value;
  }

  const formatedDomain = value.toLowerCase().normalize('NFD').replace(/[^a-z0-9&\-\s]/g, '')
    .replace(/\s/g, '-')
    .replace(/&/g, 'e');
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

yup.setLocale({
  mixed: {
    default: 'Não é válido',
    required: 'O campo precisa estar preenchido',
  },
  string: {
    min: 'O mínimo de caracteres é ${min}',
    max: 'O máximo de caracteres é ${max}',
    email: 'Precisa ser um email válido',
  },
});

const schema = yup.object().shape({
  nome: yup
    .string()
    .max(100)
    .required(),
  zap: yup
    .string()
    .min(10)
    .max(15)
    .required(),
  endereco: yup
    .string()
    .max(100)
    .min(3)
    .required(),
  password: yup
    .string()
    .min(4)
    .max(20)
    .required(),
  confirmarPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas não são as mesmas'),
  domain: yup
    .string()
    .max(150)
    .required(),
});

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    minHeight: '100vh',
    display: 'flex',
  },
  link: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
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
}));

function SignUpScreen() {
  const [open, setOpen] = useState(false);
  const openSnackBar = () => {
    setOpen(true);
  };
  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const classes = useStyles();
  const [img64, setImg64] = useState<string>('');
  const [dominioIsValid, setDominioIsValid] = useState<boolean>(true);
  const [zapIsValid, setZapIsValid] = useState<boolean>(true);
  const [touchedName, setTouchedName] = useState<boolean>(false);
  const [touchedZap, setTouchedZap] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<any>(undefined);
  const [prefix, setPrefix] = useState<string | undefined>();
  const router = useRouter();

  const onSubmit = async (values:any) => {
    const params: any = values;
    params.imgBase64 = img64;
    delete params.confirmarSenha;
    if (!params.seller) {
      params.seller = false;
    }
    if (!params.delivery) {
      params.delivery = false;
    }
    // eslint-disable-next-line prefer-destructuring
    params.endereco = values.endereco;
    params.lat = latLong.lat;
    params.lng = latLong.lng;
    params.prefix = prefix;
    const responsePerfil = await perfisService.save(params);

    if (responsePerfil.ok) {
      const loginValues: any = {};
      loginValues.strategy = 'local';
      loginValues.phone = values.zap;
      loginValues.password = values.password;
      const response = await usersService.login(loginValues);
      if (response.ok) {
        keepSession(values.zap, response.data);
        router.push(params.seller ? '/editPerfil' : '/');
      }
    } else {
      openSnackBar();
    }
  };

  const dominioMutator = (fieldNameOrigin: string, state:any, { changeValue }:any) => {
    if (fieldNameOrigin[0] === 'nome') {
      const value = state.formState.values[fieldNameOrigin];
      const nome = buildNome(value);
      const dominio = buildDomain(nome);
      changeValue(state, 'nome', () => nome);
      changeValue(state, 'domain', () => dominio);
    }
    const nome = state.formState.values[fieldNameOrigin];
    const dominio = buildDomain(nome);
    changeValue(state, 'domain', () => dominio);
  };

  const changeEndereco = (selectedAddress: string, state:any, { changeValue }:any) => {
    changeValue(state, 'endereco', () => selectedAddress[0]);
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

  const {
    form, handleSubmit, pristine, submitting,
  } = useForm({
    onSubmit, // the function to call with your form values upon valid submit
    validate, // a record-level validation function to check all form values
    mutators: { dominioMutator, changeEndereco },
  });

  const nome = useField('nome', form);
  const endereco = useField('endereco', form);
  const zap = useField('zap', form);
  const password = useField('password', form);
  const confirmarPassword = useField('confirmarPassword', form);
  const seller = useField('seller', form);
  const delivery = useField('delivery', form);
  const palavrasChaves = useField('palavrasChaves', form);
  const domain = useField('domain', form);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const image = useField('image', form);

  const handleImage = (base64: any) => {
    setImg64(base64);
    form.change('image', true);
  };

  const validateDomain = async (value:string) => {
    const dominio = buildDomain(value);
    if (dominio) {
      const response = await perfisService.checkDomain(dominio);
      setDominioIsValid(response.data.length === 0);
    }
  };

  const validateZap = async (value:string) => {
    if (value) {
      const response = await perfisService.checkZap(value);
      setZapIsValid(response.data.length === 0);
    }
  };

  const touchName = () => {
    setTouchedName(true);
  };

  const touchZap = () => {
    setTouchedZap(true);
  };

  const getLevelAddress = (addressParts:any, levelDescription:any) => addressParts.find((addressPart:any) => addressPart.types.includes(levelDescription));

  const handleAddressSelect = (address:string) => {
    geocodeByAddress(address)
      .then((results) => {
        const country = getLevelAddress(results[0].address_components, 'country');
        if (country.short_name === 'BR') {
          setPrefix('55');
        }
        if (country.short_name === 'UK') {
          setPrefix('44');
        }
        return getLatLng(results[0]);
      })
      .then((latLng) => setLatLong(latLng))
      .catch((error) => error);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="flex-end">
            <Grid item xs="auto" sm="auto">
              <Box p={2}>
                <Typography className={classes.link} component="span">
                  <Link href="/" color="inherit">
                    Pesquisar
                  </Link>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs="auto" sm="auto">
              <Box p={2}>
                <Typography className={classes.link} component="span">
                  <Link href="/entrar" color="inherit">
                    Entrar
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <div className={classes.root}>
        <Box p={2}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container justify="center">
                  <Grid item xs="auto" md={3} lg={2}>
                    <Box pb={2}>
                      <ImageUpload onChangeImage={handleImage} rounded />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={9} sm={12} lg={10}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6}>
                        <TextField
                          {...nome.input}
                          label="Nome"
                          variant="outlined"
                          fullWidth
                          id="nome"
                          error={touchedName && nome.meta.invalid}
                          helperText={
                            touchedName
                            && nome.meta.invalid
                            && nome.meta.error
                          }
                          onBlur={() => {
                            form.mutators.dominioMutator('nome');
                            validateDomain(nome.input.value);
                            touchName();
                          }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <TextField
                          {...domain.input}
                          label="Dominio"
                          onBlur={() => {
                            form.mutators.dominioMutator('domain');
                            validateDomain(domain.input.value);
                          }}
                          variant="outlined"
                          fullWidth
                          id="domain"
                          error={!dominioIsValid}
                          helperText={
                            !dominioIsValid
                            && domain.meta.invalid
                            && domain.meta.error
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <PlacesAutocomplete
                          {...endereco.input}
                          onSelect={(address) => {
                            handleAddressSelect(address);
                            form.mutators.changeEndereco(address);
                          }}
                          searchOptions={searchOptions}
                        >
                          {({
                            getInputProps, suggestions, getSuggestionItemProps, loading,
                          }) => (
                            <div>
                              <TextField
                                {...getInputProps({
                                  placeholder: 'Endereço',
                                })}
                                variant="outlined"
                                fullWidth
                                id="endereco"
                                label="Endereço"
                                error={endereco.meta.touched && endereco.meta.invalid}
                                helperText={
                                  endereco.meta.touched
                                  && endereco.meta.invalid
                                  && endereco.meta.error
                                }
                                InputProps={{
                                  endAdornment: (
                                    <>
                                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    </>
                                  ),
                                }}
                              />
                              <div className="autocomplete-dropdown-container">
                                {suggestions.map((suggestion) => {
                                  const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? { backgroundColor: '#bdbdbd', cursor: 'pointer' }
                                    : { backgroundColor: '#e0e0e0', cursor: 'pointer' };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                      })}
                                    >
                                      <Box p={2}>
                                        <Typography>{suggestion.description}</Typography>
                                      </Box>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={12}>
                            <TextField
                              {...palavrasChaves.input}
                              label="Palavras Chaves"
                              variant="outlined"
                              fullWidth
                              id="palavrasChaves"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption">
                              Coloque aqui o nome de alguns produtos ou serviços que
                              você trabalha, assim as pessoas te encontrarão mais
                              fácil.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} justify="flex-end">
                  <Grid item xs={12}>
                    <Typography variant="h5" color="textSecondary">
                      Dados de login:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MaskedTextField
                      id="zap"
                      label="Whatsapp"
                      field={zap}
                      validateZap={validateZap}
                      isTouched={touchedZap}
                      touch={touchZap}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...password.input}
                      label="Senha"
                      variant="outlined"
                      fullWidth
                      type="password"
                      id="password"
                      error={password.meta.touched && password.meta.invalid}
                      helperText={
                        password.meta.touched
                        && password.meta.invalid
                        && password.meta.error
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...confirmarPassword.input}
                      label="Confirmar senha"
                      variant="outlined"
                      fullWidth
                      type="password"
                      id="confirmarPassword"
                      error={
                        confirmarPassword.meta.touched
                        && confirmarPassword.meta.invalid
                      }
                      helperText={
                        confirmarPassword.meta.touched
                        && confirmarPassword.meta.invalid
                        && confirmarPassword.meta.error
                      }
                    />
                  </Grid>
                  <Grid item xs="auto">
                    <FormControlLabel
                      control={<Checkbox {...seller.input} />}
                      label="Quero vender"
                    />
                  </Grid>
                  <Grid item xs="auto">
                    <Collapse in={seller.input.value === true}>
                      <FormControlLabel control={<Checkbox {...delivery.input} />} label="Faço entregas" />
                    </Collapse>
                  </Grid>
                  <Grid item xs="auto">
                    <div className={classes.wrapper}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={pristine || submitting}
                        type="submit"
                      >
                        Criar conta
                      </Button>
                      {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="error">Seu cadastro não pode ser finalizado.</Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default SignUpScreen;
