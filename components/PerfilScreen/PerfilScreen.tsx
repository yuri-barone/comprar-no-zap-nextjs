import {
  Box,
  Button,
  Checkbox,
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
  nome: yup.string().min(5).required(),
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
}));

function PerfilScreen({
  src,
  nome,
  zap,
  endereco,
  id,
  searchNewPerfil,
  seller,
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
    },
  });
  const nomeInput = useField('nome', form);
  const zapInput = useField('zap', form);
  const enderecoInput = useField('endereco', form);
  const sellerBox = useField('seller', form);

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
        <Box p={3}>
          <Grid container>
            <Grid item xs={3}>
              <ImageUpload
                onChangeImage={handleImage}
                rounded
                defaultImage={src}
              />
            </Grid>
            <Grid item xs={9}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      {...nomeInput.input}
                      id="nome"
                      label="Nome da empresa"
                      variant="outlined"
                      error={nomeInput.meta.touched && nomeInput.meta.invalid}
                      helperText={
                        nomeInput.meta.touched
                        && nomeInput.meta.invalid
                        && nomeInput.meta.error
                      }
                      defaultValue={nome}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...zapInput.input}
                      id="zap"
                      label="Whatsapp"
                      variant="outlined"
                      error={zapInput.meta.touched && zapInput.meta.invalid}
                      helperText={
                        zapInput.meta.touched
                        && zapInput.meta.invalid
                        && zapInput.meta.error
                      }
                      defaultValue={zap}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...enderecoInput.input}
                      id="endereco"
                      label="Endereço"
                      variant="outlined"
                      error={
                        enderecoInput.meta.touched && enderecoInput.meta.invalid
                      }
                      helperText={
                        enderecoInput.meta.touched
                        && enderecoInput.meta.invalid
                        && enderecoInput.meta.error
                      }
                      defaultValue={endereco}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel control={<Checkbox defaultChecked={seller} {...sellerBox.input} />} label="Quero vender" />
                  </Grid>
                  <Grid item xs={12}>
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
          <Alert onClose={handleDangerClose} severity="error">
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
          <Alert onClose={handleSuccessClose} severity="success">
            Perfil atualizado com sucesso.
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

PerfilScreen.defaultProps = {
  src:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/1200px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg',
  nome: 'Marcos Zuck e Berg',
  endereco: 'California Windows State',
  zap: '+554433221100',
};

export default PerfilScreen;
