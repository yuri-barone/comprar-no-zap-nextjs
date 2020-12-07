/* eslint-disable max-len */
/* eslint-disable no-template-curly-in-string */
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
import ordersService from '../services/ordersService';

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
  endereco: yup
    .string()
    .when('entrega', { is: true, then: yup.string().min(3).required() }),
  metodoPagamento: yup.string().required('Selecione o pagamento'),
  nome: yup.string().required().max(50),
});

const generateZapLink = (
  zap: number,
  products: Array<any>,
  paymentMethod: string,
  enderecoParam: string,
  trocoParam: number,
  obs: string,
  nome: string,
  codigo?: string,
) => {
  const stringProducts = products.map((produto) => `${produto.quantidade}%20${produto.titulo}%0a`);
  const validateEntrega = () => {
    if (enderecoParam) {
      return `%0a%0a*Entregar%20em*%0a${enderecoParam}`;
    }
    return '%0a%0a*Irei%20buscar*';
  };
  const validateCodigo = () => {
    if (codigo) {
      return `%0a%0a*Imprimir:*%0ahttps://comprarnozap.com/pedidos?codigo=${codigo}`;
    }
    return '';
  };
  const validateTroco = () => {
    if (!!trocoParam && paymentMethod === 'Dinheiro') {
      return `(Troco para ${formatNumberToMoneyWithSymbol(trocoParam, 'R$')})`;
    }
    return '';
  };
  // eslint-disable-next-line consistent-return
  const getObs = () => {
    if (obs) {
      return `%0a*Observações:*%20_${obs}_%0a`;
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
  const link = `https://api.whatsapp.com/send?phone=${validateZap()}&text=%20Pedido%20realizado%20no%20*comprarnozap.com*%0a%0a*Nome*%0a${nome}%0a%0a*Pedido*%0a${stringProducts.join(
    '',
  )}${getObs()}%0a*Forma%20de%20pagamento*%0a${paymentMethod}${temTroco}${formaDeReceber}${validateCodigo()}`;
  return link;
};

const useStyles = makeStyles((theme) => ({
  formWidth: {
    width: '100%',
  },
  buttonProgress: {
    color: theme.palette.primary.light,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}));

export type CartDetailsProps = {
  cartProductsData: Array<any>;
  changeItemQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  initialValues: any;
  perfDelivery: boolean;
  perfEndereco: string;
  perfName: string;
  perfId:number;
};

const CartDetails = ({
  cartProductsData,
  changeItemQuantity,
  removeItem,
  initialValues,
  perfDelivery,
  perfEndereco,
  perfName,
  perfId,
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

  const openLink = async (values:any, resp:any) => {
    const order = await ordersService.getOrderById(resp.data.id);
    const link = generateZapLink(
      Number(values.products[0].zap),
      values.products,
      values.metodoPagamento,
      values.entrega ? values.endereco : undefined,
      values.troco,
      values.obs,
      values.nome,
      order?.data?.codigo,
    );
    window.open(link);
  };

  const onSubmit = async (values: any) => {
    const args:any = values;
    args.valorTotal = totalValue;
    const produtos = cartProductsData.map((product) => ({
      titulo: product.product.titulo, valorUnitario: product.product.valor, quantidade: product.quantity, valorTotal: product.product.valor * product.quantity, zap: product.product.zap,
    }));
    args.products = produtos;
    args.endereco = values.entrega ? values.endereco : undefined;
    args.codigo = perfName.substring(0, 3).toUpperCase();
    args.perfilId = perfId;
    args.delivery = values.entrega ? values.entrega : false;
    args.formaPagamento = values.metodoPagamento;
    args.observacao = values.obs ? values.obs : undefined;
    args.troco = values.troco ? values.troco : undefined;
    const response = await ordersService.createOrder(args);
    if (response.ok) {
      openLink(values, response);
    }
    if (!response.ok) {
      openLink(values, undefined);
    }
  };

  const {
    form, handleSubmit, pristine, submitting,
  } = useForm({
    validate, // a record-level validation function to check all form values
    initialValues,
    onSubmit, // the function to call with your form values upon valid submit☻☻
  });
  const endereco = useField('endereco', form);
  const troco = useField('troco', form);
  const entrega = useField('entrega', form);
  const metodoPagamento = useField('metodoPagamento', form);
  const obs = useField('obs', form);
  const nome = useField('nome', form);

  return (
    <form className={classes.formWidth} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {cartProductsData.map((item) => (
              <Grid item xs="auto">
                <ItemShowDetails
                  quantity={item.quantity}
                  productValue={item.product.valor}
                  productName={item.product.titulo}
                  productId={item.product.id}
                  pictureId={item.product.pictureId}
                  key={item.product.id}
                  changeItemQuantity={changeItemQuantity}
                  removeItem={removeItem}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Box p={2} style={{ width: '100%' }}>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {perfDelivery === false && (
                  <Grid item xs>
                    <Typography>
                      <Box fontWeight="fontWeightBold" m={1}>
                        Apenas retiradas no local:
                      </Box>
                    </Typography>
                    <Typography>
                      <Box fontWeight="fontWeightMedium" m={1}>
                        {perfEndereco}
                      </Box>
                    </Typography>
                  </Grid>
                  )}
                  {perfDelivery === true && (
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
                  )}
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
              <Grid item xs={12}>
                <Box pb={2} pt={2}>
                  <TextField
                    error={nome.meta.touched && nome.meta.invalid}
                    helperText={
                      nome.meta.touched
                      && nome.meta.invalid
                      && nome.meta.error
                    }
                    {...nome.input}
                    multiline
                    rowsMax={2}
                    label="Seu nome"
                    fullWidth
                  />
                </Box>
                <Box pb={2}>
                  <TextField
                    error={obs.meta.touched && obs.meta.invalid}
                    helperText={
                      obs.meta.touched
                      && obs.meta.invalid
                      && obs.meta.error
                    }
                    {...obs.input}
                    multiline
                    rowsMax={2}
                    label="Observações"
                    placeholder="Ex: tirar a cebola, cortar os lanches, etc."
                    fullWidth
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">
                      Total:
                      {' '}
                      {formatNumberToMoneyWithSymbol(totalValue, 'R$')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container justify="flex-end">
                      <Grid item xs="auto">
                        <div className={classes.wrapper}>
                          <Button type="submit" variant="contained" color="primary" disabled={pristine || submitting}>
                            Pedir no zap
                          </Button>
                          {submitting && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default CartDetails;
