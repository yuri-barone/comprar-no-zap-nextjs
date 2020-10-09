import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import React, { useState } from "react";
import ImageUpload from "../ImageUpload/ImageUpload";
import { useForm, useField } from "react-final-form-hooks";
import { ValidationErrors } from "final-form";
import ResetOnSubmitSuccess from "../clearForm"
import * as yup from "yup";

export type ProductRegisterProps = {
  onSave: (productData:any) => void;
  initialValues?: any;
  defaultImage?: string;
  onCancel?: () => void;
}

yup.setLocale({
  mixed: {
    default: "Não é válido",
    required: "O campo precisa estar preenchido",
  },
  number: {},
});

const schema = yup.object().shape({
  titulo: yup.string().min(5).required(),
  descricao: yup.string(),
  valor: yup
    .number()
    .typeError("Valor precisa ser um número")
    .positive()
    .required(),
});

const useStyles = makeStyles((theme) => ({
  root: {
  },
  input: {
    display: "none",
  },
  buttonUpload: {
    position: "absolute",
    zIndex: 99,
    width: 250,
    height: 200,
  },
}));




function ProductRegister({onSave, initialValues, defaultImage, onCancel}:ProductRegisterProps) {
  const [img64, setImg64] = useState<string>("");
  const classes = useStyles();
  const imgActions:any = {}
  
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
    onSubmit: (values) => onSave({...values, imgBase64: img64}),
    validate,
    initialValues,
  });
  const titulo = useField("titulo", form);
  const descricao = useField("descricao", form);
  const valor = useField("valor", form);

  const handleImage = (base64: any) => {
    setImg64(base64);    
  };

  const configureActions = (actions:any) => {
    imgActions.clear = actions.clear
  }

  const onSubmitSuccess = () => {
    form.reset()
    imgActions.clear()
  }

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <ImageUpload defaultImage={defaultImage} onChangeImage={handleImage} configureActions={configureActions}  />
      </CardActionArea>
      <CardContent>
        <form onSubmit={handleSubmit}>
        <ResetOnSubmitSuccess form={form} onSubmitSuccess={onSubmitSuccess} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="titulo"
                label="Titulo do produto"
                variant="outlined"
                fullWidth
                {...titulo.input}
                error={titulo.meta.touched && submitting && titulo.meta.invalid }
                helperText={
                  titulo.meta.touched &&
                  titulo.meta.invalid &&
                  submitting &&
                  titulo.meta.error
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...descricao.input}
                error={descricao.meta.touched && submitting && descricao.meta.invalid}
                helperText={
                  descricao.meta.touched &&
                  descricao.meta.invalid &&
                  submitting &&
                  descricao.meta.error
                }
                id="descricao"
                label="Descrição do produto"
                multiline
                rowsMax={4}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={valor.meta.touched && submitting && valor.meta.invalid}
                helperText={
                  valor.meta.touched && valor.meta.invalid && submitting && valor.meta.error
                }
                {...valor.input}
                id="valor"
                label="Valor do produto"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="flex-end" spacing={2}>
              {initialValues && <Grid item>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onCancel}
                  >
                    Cancelar
                  </Button>
                </Grid>}
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={pristine || submitting}
                    type="submit"
                  >
                    Salvar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProductRegister;
