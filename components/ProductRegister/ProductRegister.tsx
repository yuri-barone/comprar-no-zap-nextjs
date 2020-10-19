/* eslint-disable no-template-curly-in-string */
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm, useField } from 'react-final-form-hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import * as yup from 'yup';
import ResetOnSubmitSuccess from '../clearForm';
import ImageUpload from '../ImageUpload/ImageUpload';

export type ProductRegisterProps = {
  onSave: (productData: any) => void;
  initialValues?: any;
  defaultImage?: string;
  uploaderKey?: string,
  onCancel?: () => void;
};

yup.setLocale({
  mixed: {
    default: 'Não é válido',
    required: 'O campo precisa estar preenchido',
  },
  string: {
    min: 'O mínimo de caracteres é ${min}',
    max: 'O valor máximo de caracteres é ${max}',
  },
  number: {
    max: 'O valor máximo permitido é R$${max},00',
    positive: 'O valor precisa ser positivo',
  },
});

const schema = yup.object().shape({
  titulo: yup
    .string()
    .min(5)
    .max(100)
    .required(),
  descricao: yup.string().max(244),
  valor: yup
    .number()
    .typeError('Valor precisa ser um número')
    .positive()
    .max(100000)
    .required(),
});

const ProductRegister = ({
  onSave,
  initialValues,
  defaultImage,
  uploaderKey,
  onCancel,
}: ProductRegisterProps) => {
  const [img64, setImg64] = useState<string>(defaultImage);
  const imgActions: any = {};

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
    onSubmit: (values) => onSave({ ...values, imgBase64: img64 }),
    validate,
    initialValues,
  });
  const titulo = useField('titulo', form);
  const descricao = useField('descricao', form);
  const valor = useField('valor', form);

  const handleImage = (base64: any) => {
    setImg64(base64);
  };

  const configureActions = (actions: any) => {
    imgActions.clear = actions.clear;
  };

  const onSubmitSuccess = () => {
    form.reset();
    imgActions.clear();
    setImg64(defaultImage);
    form.resetFieldState('titulo');
    form.resetFieldState('descricao');
    form.resetFieldState('valor');
  };

  return (
    <Card>
      <CardActionArea>
        <ImageUpload
          defaultImage={defaultImage}
          onChangeImage={handleImage}
          configureActions={configureActions}
          uploaderKey={uploaderKey}
        />
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
                error={titulo.meta.touched && titulo.meta.invalid}
                helperText={
                  titulo.meta.touched
                  && titulo.meta.invalid
                  && titulo.meta.error
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...descricao.input}
                error={descricao.meta.touched && descricao.meta.invalid}
                helperText={
                  descricao.meta.touched
                  && descricao.meta.invalid
                  && descricao.meta.error
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
                error={valor.meta.touched && valor.meta.invalid}
                helperText={
                  valor.meta.touched && valor.meta.invalid && valor.meta.error
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
                {initialValues && (
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={onCancel}
                    >
                      Cancelar
                    </Button>
                  </Grid>
                )}
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      (pristine && img64 === defaultImage) || submitting
                    }
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
};

export default ProductRegister;
