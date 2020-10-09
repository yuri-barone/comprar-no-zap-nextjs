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
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { ValidationErrors } from "final-form";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm, useField } from "react-final-form-hooks";
import * as yup from "yup";
import ImageUpload from "../ImageUpload/ImageUpload";
import perfisService from '../services/perfisService';
import usersService from "../services/usersService";
import { keepSession } from "../useSession";

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
  nome: yup.string().required(),
  zap: yup.string().min(10).required(),
  endereco: yup.string().min(3).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmarPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não são as mesmas"),
});

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    minHeight: "100vh",
    display: "flex",
  },
  link: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

function SignUpScreen() {
  const [open, setOpen] = useState(false);
  const imgActions:any = {}
  const openSnackBar = () => {
    setOpen(true);
  };
  const handleClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const classes = useStyles();
  const [img64, setImg64] = useState<string>("")
  const router = useRouter();

  const onSubmit = async (values: any) => {
    values["imgBase64"] = img64;
    delete values.confirmarSenha;
    values.email = values.email.toLowerCase()

    const response = await perfisService.save(values)
    if (response.ok) {
      let loginValues:any = {}
      loginValues["strategy"] = "local";
      loginValues["email"] = values.email.toLowerCase()
      loginValues["password"] = values.password
      const response = await usersService.login(loginValues);
      if (response.ok) {
        keepSession(values.email.split("@")[0], response.data);
        router.push("/produtos");
      }
    } else {
      openSnackBar();
    }
  };

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
    onSubmit, // the function to call with your form values upon valid submit
    validate, // a record-level validation function to check all form values
  });

  const nome = useField("nome", form);
  const endereco = useField("endereco", form);
  const zap = useField("zap", form);
  const email = useField("email", form);
  const password = useField("password", form);
  const confirmarPassword = useField("confirmarPassword", form);
  const seller = useField("seller", form)
  const palavrasChaves = useField("palavrasChaves", form)

  
  const handleImage = (base64:any) => {
    setImg64(base64);
  }
  const configureActions = (actions: any) => {
    imgActions;
  };

  return (
    <>
    <Grid container spacing={2}>
        <Grid item xs></Grid>
        <Grid item xs="auto">
          <Box p={2}>
            <Typography className={classes.link}>
              <Link href="/" color="inherit">
                Ir para a página inicial
              </Link>
              <Link href="/entrar" color="inherit">
                Entrar em minha conta
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider />
    <div className={classes.root}>
      <Box p={2}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={3}>
                  <ImageUpload onChangeImage={handleImage} rounded={true} configureActions={configureActions}/>
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        {...nome.input}
                        label="Nome"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        id="nome"
                        error={nome.meta.touched && nome.meta.invalid}
                        helperText={
                          nome.meta.touched &&
                          nome.meta.invalid &&
                          nome.meta.error
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        {...endereco.input}
                        label="Endereço"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        id="endereco"
                        error={endereco.meta.touched && endereco.meta.invalid}
                        helperText={
                          endereco.meta.touched &&
                          endereco.meta.invalid &&
                          endereco.meta.error
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        {...zap.input}
                        label="Whatsapp"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        id="zap"
                        type="number"
                        error={zap.meta.touched && zap.meta.invalid}
                        helperText={
                          zap.meta.touched && zap.meta.invalid && zap.meta.error
                        }
                      />
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
                <Grid item xs={3}>
                  <TextField
                    {...email.input}
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    id="email"
                    error={email.meta.touched && email.meta.invalid}
                    helperText={
                      email.meta.touched &&
                      email.meta.invalid &&
                      email.meta.error
                    }
                  ></TextField>
                </Grid>
                <Grid item xs={3}>
                  <Grid container>
                    <Grid item xs={12}>
                  <TextField
                    {...palavrasChaves.input}
                    label="Palavras Chaves"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    id="palavrasChaves"
                  ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">
                      Descreva com palavras chaves aquilo que se encontrará na sua loja, assim as pessoas vão te encontrar mais facilmente
                    </Typography>
                  </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    {...password.input}
                    label="Senha"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    type="password"
                    id="password"
                    error={password.meta.touched && password.meta.invalid}
                    helperText={
                      password.meta.touched &&
                      password.meta.invalid &&
                      password.meta.error
                    }
                  ></TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    {...confirmarPassword.input}
                    label="Confirmar senha"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    type="password"
                    id="confirmarPassword"
                    error={
                      confirmarPassword.meta.touched && confirmarPassword.meta.invalid
                    }
                    helperText={
                      confirmarPassword.meta.touched &&
                      confirmarPassword.meta.invalid &&
                      confirmarPassword.meta.error
                    }
                  ></TextField>
                </Grid>
                <Grid item xs="auto">
                <FormControlLabel control={<Checkbox {...seller.input} />} label="Quero vender" />
              </Grid>
                <Grid item xs="auto">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={pristine || submitting}
                    type="submit"
                  >
                    Criar conta
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Seu cadastro não pode ser finalizado.
        </Alert>
      </Snackbar>
    </div>
    </>
  );
}

export default SignUpScreen;
