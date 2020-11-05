import {
  Box,
  Button,
  Checkbox,
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
import React, { useState } from 'react';
import { useForm, useField } from 'react-final-form-hooks';

import * as yup from 'yup';
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
}: PerfilScreenProps) {
  const [img64, setImg64] = useState<any>(src);
  const [openDanger, setOpenDanger] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
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
    } else {
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

  const classes = useStyles();
  const { form, handleSubmit } = useForm({
    onSubmit,
    validate,
    initialValues: {
      nome,
      zap,
      endereco,
      seller,
      delivery,
      palavrasChaves,
    },
  });
  const nomeInput = useField('nome', form);
  const zapInput = useField('zap', form);
  const enderecoInput = useField('endereco', form);
  const sellerBox = useField('seller', form);
  const deliveryBox = useField('delivery', form);
  const palavrasChavesInput = useField('palavrasChaves', form);

  const handleImage = (base64: any) => {
    setImg64(base64);
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
          <Grid container justify="center" spacing={2}>
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
                  <Grid item xs={12} sm={8}>
                    <TextField
                      {...nomeInput.input}
                      id="nome"
                      label="Nome da empresa"
                      variant="outlined"
                      fullWidth
                      error={nomeInput.meta.touched && nomeInput.meta.invalid}
                      helperText={
                        nomeInput.meta.touched
                        && nomeInput.meta.invalid
                        && nomeInput.meta.error
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MaskedTextField
                      id="zap"
                      label="Whatsapp"
                      field={zapInput}
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
                    <Button variant="contained" color="secondary" type="submit">
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
