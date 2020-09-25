import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { useForm, useField } from "react-final-form-hooks";
import * as yup from "yup";
import { ValidationErrors } from "final-form";
import usersService from "../services/usersService";
import {configureMainApi} from "../services/Api"

export type loginScreenProps = {
  onLogin: (loginData:any) => void; 
}

yup.setLocale({
  mixed: {
    default: "Não é válido",
    required: "O campo precisa estar preenchido",
  },
  string: {
    // eslint-disable-next-line no-template-curly-in-string
    min: "O mínimo de caracteres é ${min}",
    email: "Precisa ser um email válido",
  },
});

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    minHeight: "100vh",
    display: "flex",
  },
  loginContainerColor: {
    backgroundColor: theme.palette.grey[50],
    height: "100vh",
    width: "25%",
  },
  imgDiv:{
    height: "100vh"
  },
  img:{
    objectFit:"cover",
  }
}));

function LoginScreen({onLogin}:loginScreenProps) {
  const validate = (values: any): any => {
    try {
      schema.validateSync(values, { abortEarly: false });
    } catch (errors) {
      let formErrors: any = {};
      errors.inner.forEach((erro: ValidationErrors) => {
        formErrors[erro.path] = erro.message;
      });
      return formErrors;
    }
    return;
  };

  const { form, handleSubmit, pristine, submitting } = useForm({
    onSubmit:onLogin, // the function to call with your form values upon valid submit
    validate,
  });

  const email = useField("email", form);
  const password = useField("password", form);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.loginContainerColor}>
        <form onSubmit={handleSubmit}>
          <Box p={2}>
            <Grid container justify="center" spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" color="textSecondary">
                  Fazer login
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...email.input}
                  variant="outlined"
                  label="E-mail"
                  error={email.meta.touched && email.meta.invalid}
                  helperText={email.meta.touched && email.meta.invalid && email.meta.error}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...password.input}
                  variant="outlined"
                  label="Senha"
                  type="password"
                  error={password.meta.touched && password.meta.invalid}
                  helperText={password.meta.touched && password.meta.invalid && password.meta.error}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Checkbox />} label="Manter login" />
              </Grid>
              <Grid item xs={12}>
                <IconButton type="submit" disabled={pristine || submitting}>
                  <ArrowForwardIcon fontSize="large" />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  <Link color="inherit">Problemas com login?</Link>
                  <br />
                  <Link color="inherit">Criar conta</Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </form>
      </div>
      <div className={classes.imgDiv}>
        <img alt="" src="/pedir-no-zap-wallpaper.jpg" className={classes.img} height="100%" width="100%"></img>
      </div>
    </div>
  );
}

export default LoginScreen;
