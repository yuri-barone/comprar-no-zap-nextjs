import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import React, { useMemo } from 'react';
import { useForm, useField } from 'react-final-form-hooks';
import * as yup from 'yup';
import { formatNumberToMoneyWithSymbol } from '../../formatters';
import ItemShowDetails from '../ItemShowDetails/ItemShowDetails';

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
  endereco: yup
    .string()
    .when('entrega', { is: true, then: yup.string().min(3).required() }),
  metodoPagamento: yup.string().required('Selecione o pagamento'),
});

const generateZapLink = (
  zap: number,
  products: Array<any>,
  paymentMethod: string,
  enderecoParam: string,
  trocoParam: number,
) => {
  const stringProducts = products.map((produto) => `${produto.quantity}%20${produto.product.titulo}%0a`);
  const validateEntrega = () => {
    if (enderecoParam) {
      return `%0a%0a*Entregar%20em*%0a${enderecoParam}`;
    }
    return '%0a%0a*Irei%20buscar*';
  };

  const validateTroco = () => {
    if (!!trocoParam && paymentMethod === 'Dinheiro') {
      return `(Troco para ${formatNumberToMoneyWithSymbol(trocoParam, 'R$')})`;
    }
    return '';
  };
  const validateZap = () => {
    const numero = zap.toString();
    if (!numero.startsWith('55')) {
      return `55${numero}`;
    }
    return numero;
  };
  const temTroco = validateTroco();
  const formaDeReceber = validateEntrega();
  const link = `https://api.whatsapp.com/send?phone=${validateZap()}&text=%20Pedido%20realizado%20no%20*comprarnozap.com*%0a%0a*Pedido*%0a${stringProducts.join(
    '',
  )}%0a*Forma%20de%20pagamento*%0a${paymentMethod}${temTroco}${formaDeReceber}`;
  return link;
};

const useStyles = makeStyles({
  formWidth: {
    width: '100%',
  },
});

export type CartDetailsProps = {
  cartProductsData: Array<any>;
  changeItemQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  initialValues: any;
};

const CartDetails = ({
  cartProductsData,
  changeItemQuantity,
  removeItem,
  initialValues,
}: CartDetailsProps) => {
  const classes = useStyles();

  const totalValue = useMemo(() => {
    let total = 0;
    cartProductsData.forEach((item) => {
      total += item.product.valor * item.quantity;
    });
    return total;
  }, [cartProductsData]);

  // eslint-disable-next-line consistent-return
  const validate = (values: any) => {
    try {
      schema.validateSync(values, { abortEarly: false });
    } catch (errors) {
      const formErrors: any = {};
      errors.inner.forEach((erro:ValidationErrors) => {
        formErrors[erro.path] = erro.message;
      });
      return formErrors;
    }
  };

  const onSubmit = (values: any) => {
    const args:any = values;
    args.products = cartProductsData;
    const link = generateZapLink(
      Number(values.products[0].product.zap),
      values.products,
      values.metodoPagamento,
      values.entrega ? values.endereco : undefined,
      values.troco,
    );
    const win = window.open(link, '_blank');
    win.focus();
  };

  const {
    form, handleSubmit,
  } = useForm({
    validate, // a record-level validation function to check all form values
    initialValues,
    onSubmit, // the function to call with your form values upon valid submit☻☻
  });
  const endereco = useField('endereco', form);
  const troco = useField('troco', form);
  const entrega = useField('entrega', form);
  const metodoPagamento = useField('metodoPagamento', form);

  return (
    <form className={classes.formWidth} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {cartProductsData.map((item) => (
              <Grid item xs="auto">
                <ItemShowDetails
                  src={item.product.imgBase64}
                  quantity={item.quantity}
                  productValue={item.product.valor}
                  productName={item.product.titulo}
                  productId={item.product.id}
                  key={item.product.id}
                  changeItemQuantity={changeItemQuantity}
                  removeItem={removeItem}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs>
              <FormControlLabel
                control={<Checkbox color="primary" {...entrega.input} />}
                label="Entregar"
              />
              <Collapse in={entrega.input.value === true}>
                <TextField
                  error={endereco.meta.touched && endereco.meta.invalid}
                  helperText={
                    endereco.meta.touched
                    && endereco.meta.invalid
                    && endereco.meta.error
                  }
                  {...endereco.input}
                  label="Endereço de entrega"
                  fullWidth
                />
              </Collapse>
            </Grid>
            <Grid item xs="auto">
              <FormControl
                component="fieldset"
                error={
                  metodoPagamento.meta.touched && metodoPagamento.meta.invalid
                }
              >
                <RadioGroup row name="payment" {...metodoPagamento.input}>
                  <FormControlLabel
                    value="Cartão"
                    control={<Radio />}
                    label="Cartão"
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    value="Dinheiro"
                    control={<Radio />}
                    label="Dinheiro"
                    labelPlacement="end"
                  />
                </RadioGroup>
                <FormHelperText>
                  {metodoPagamento.meta.touched
                    && metodoPagamento.meta.invalid
                    && metodoPagamento.meta.error}
                </FormHelperText>
              </FormControl>
              <Collapse in={metodoPagamento.input.value === 'Dinheiro'}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                  error={troco.meta.touched && troco.meta.invalid}
                  helperText={
                    troco.meta.touched && troco.meta.invalid && troco.meta.error
                  }
                  {...troco.input}
                  type="number"
                  label="Troco para:"
                />
              </Collapse>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6} sm={6}>
          <Typography variant="h6">
            Total:
            {' '}
            {formatNumberToMoneyWithSymbol(totalValue, 'R$')}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Grid container justify="flex-end">
            <Grid item xs="auto">
              <Button type="submit" variant="contained" color="primary">
                Pedir no zap
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default CartDetails;
