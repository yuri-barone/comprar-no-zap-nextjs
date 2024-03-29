import {
  Box,
  Button,
  Container,
  Grid,
  Hidden,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useForm, useField } from 'react-final-form-hooks';
import * as yup from 'yup';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';
import MaskedTextFieldNonValidate from '../MaskedTextFieldNonValidate';

export type LoginScreenProps = {
  onLogin: (loginData: any) => void;
};

yup.setLocale({
  mixed: {
    default: 'Não é válido',
    required: 'O campo precisa estar preenchido',
  },
  string: {
    // eslint-disable-next-line no-template-curly-in-string
    min: 'O mínimo de caracteres é ${min}',
    email: 'Precisa ser um email válido',
  },
});

const schema = yup.object().shape({
  password: yup
    .string()
    .min(4)
    .required(),
});

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    minHeight: '100vh',
    display: 'flex',
  },
  fullHeight: {
    minHeight: '100vh',
  },
  loginContainerColor: {
    backgroundColor: theme.palette.grey[50],
    height: '100vh',
    width: '30%',
  },
  greenBackground: {
    backgroundColor: green[50],
  },
  imgDiv: {
    height: '100vh',
  },
  img: {
    objectFit: 'cover',
  },
  logo: {
    width: '100%',
  },
}));

function LoginScreen({ onLogin }: LoginScreenProps) {
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
    onSubmit: onLogin, // the function to call with your form values upon valid submit
    validate,
  });

  const phoneInput = useField('phone', form);
  const passwordInput = useField('password', form);
  const classes = useStyles();

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={6}>
          <Box pb={2} pt={2}>
            <a href="/">
              <img
                alt=""
                src="/comprar-no-zap-logo-vertical.svg"
                className={classes.logo}
              />
            </a>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" color="textSecondary" align="center">
            Seja bem vindo
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MaskedTextFieldNonValidate
            id="zap"
            label="Whatsapp"
            field={phoneInput}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...passwordInput.input}
            variant="outlined"
            label="Senha"
            type="password"
            error={passwordInput.meta.touched && passwordInput.meta.invalid}
            helperText={
                          passwordInput.meta.touched
                          && passwordInput.meta.invalid
                          && passwordInput.meta.error
                        }
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={pristine || submitting}
            startIcon={<ArrowForwardIcon />}
            size="large"
            fullWidth
          >
            Entrar
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <Link href="/cadastro">
              Criar conta
            </Link>
          </Typography>
          <Typography>
            <Link
              href="#"
              onClick={() => {
                const link = 'https://api.whatsapp.com/send?phone=554497737167&text=Ol%C3%A1%2C%20eu%20esqueci%20a%20minha%20senha%20do%20ComprarNoZap%20pode%20me%20ajudar%3F';
                const win = window.open(link, '_blank');
                win.focus();
              }}
            >
              Esqueci minha senha
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <>
      <Hidden lgUp>
        <Container className={clsx(classes.fullHeight, classes.greenBackground)}>
          <Box pb={2}>
            <Grid container className={classes.fullHeight}>
              {renderForm()}
            </Grid>
          </Box>
        </Container>
      </Hidden>
      <Hidden mdDown>
        <Grid container>
          <Grid item xs={3}>
            <Box p={2}>
              {renderForm()}
            </Box>
          </Grid>
          <Grid item xs={9} className={classes.fullHeight}>
            <img
              alt=""
              src="/pedir-no-zap-wallpaper.png"
              className={classes.img}
              height="100%"
              width="100%"
            />
          </Grid>
        </Grid>
      </Hidden>
    </>
  );
}

export default LoginScreen;
