import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { ValidationErrors } from "final-form";
import React, { useState } from "react";
import { useForm, useField } from "react-final-form-hooks";
import * as yup from "yup";
import ImageUpload from "../ImageUpload/ImageUpload";

yup.setLocale({
  mixed: {
    default: "Não é válido",
    required: "O campo precisa estar preenchido",
  },
  string: {
    // eslint-disable-next-line no-template-curly-in-string
    min: "O mínimo de caracteres é ${min}",
  },
});

const schema = yup.object().shape({
  name: yup.string().min(5).required(),
  zap: yup.string().min(12).required(),
  endereco: yup.string().min(3).required(),
});

export type PerfilScreenProps = {
  src?: string;
  name: string;
  zap: string;
  endereco: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[200],
    minHeight: "100vh",
    display: "flex",
  },
  avatarSize: {
    width: theme.spacing(14),
    height: theme.spacing(14),
  },
}));

function PerfilScreen({ src, name, zap, endereco }: PerfilScreenProps) {
  const [img64, setImg64] = useState<any>({src})

  const onSubmit = (values: any) => {
    values["base64"] = img64;
    const stringified = JSON.stringify(values);
    alert(stringified);
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

  const classes = useStyles();
  const { form, handleSubmit, } = useForm({
    onSubmit,
    validate,
    initialValues:{
      name, zap, endereco
    }
  });
  const nameInput = useField("name", form);
  const zapInput = useField("zap", form);
  const enderecoInput = useField("endereco", form);

  const handleImage = (base64:any) => {
    setImg64(base64);
  }

  return (
    <div className={classes.root}>
      <Box p={3}>
        <Grid container>
          <Grid item xs={3}>
          <ImageUpload onChangeImage={handleImage} rounded={true} defaultImage={src}/>
          </Grid>
          <Grid item xs={9}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    {...nameInput.input}
                    id="name"
                    label="Nome da empresa"
                    variant="outlined"
                    error={nameInput.meta.touched && nameInput.meta.invalid}
                    helperText={
                      nameInput.meta.touched &&
                      nameInput.meta.invalid &&
                      nameInput.meta.error
                    }
                    defaultValue={name}
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
                      zapInput.meta.touched &&
                      zapInput.meta.invalid &&
                      zapInput.meta.error
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
                      enderecoInput.meta.touched &&
                      enderecoInput.meta.invalid &&
                      enderecoInput.meta.error
                    }
                    defaultValue={endereco}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

PerfilScreen.defaultProps = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/1200px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
  name: "Marcos Zuck e Berg",
  endereco: "California Windows State",
  zap: "+554433221100"
}

export default PerfilScreen;
