import {
  Box,
  Button,
  Container,
  Grid,
  Hidden,
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
import useWindowSize from '../useWindowSize';

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
  email: yup
    .string()
    .email()
    .required(),
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

  const email = useField('email', form);
  const password = useField('password', form);
  const classes = useStyles();
  const windowSize = useWindowSize();

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <Grid container justify="center" spacing={2}>
        {windowSize.height > 400 && (
        <Grid item xs={6}>
          <Box pb={2} pt={2}>
            <img
              alt=""
              src="/comprar-no-zap-logo-vertical.svg"
              className={classes.logo}
            />
          </Box>
        </Grid>
        ) }
        <Grid item xs={12}>
          <Typography variant="h4" color="textSecondary" align="center">
            Seja bem vindo
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...email.input}
            variant="outlined"
            label="E-mail"
            error={email.meta.touched && email.meta.invalid}
            helperText={
                          email.meta.touched
                          && email.meta.invalid
                          && email.meta.error
                        }
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...password.input}
            variant="outlined"
            label="Senha"
            type="password"
            error={password.meta.touched && password.meta.invalid}
            helperText={
                          password.meta.touched
                          && password.meta.invalid
                          && password.meta.error
                        }
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            size="large"
            color="secondary"
            href="/cadastro"
            fullWidth
          >
            Criar conta
          </Button>
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
