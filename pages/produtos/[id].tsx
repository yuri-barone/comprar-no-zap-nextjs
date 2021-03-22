/* eslint-disable no-template-curly-in-string */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Hidden,
  InputAdornment,
  Link,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { useField, useForm } from 'react-final-form-hooks';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ValidationErrors } from 'final-form';
import * as yup from 'yup';
import PedirNoZapTheme from '../../styles/PedirNoZapTheme';
import productsService from '../../components/services/productsService';
import useSession from '../../components/useSession';
import LoggedBarIndex from '../../components/LoggedBar/LoggedBarIndex';
import perfisService from '../../components/services/perfisService';
import EnterpriseExclusiveFooter from '../../components/EnterpriseCard/EnterpriseExclusiveFooter';
import { formatNumberToMoneyWithSymbol } from '../../formatters';

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
  quantity: yup
    .number()
    .typeError('Precisa ser um número')
    .integer('A quantitade não pode ser um decimal')
    .required()
    .max(99)
    .positive('A quantidade precisa ser positiva'),
});

const useStyles = makeStyles((theme) => ({
  link: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  enterpriseShow: {
    backgroundColor: theme.palette.grey[200],
  },
  paperSize: {
    width: '100%',
    heigth: '100%',
  },
  img: {
    objectFit: 'cover',
  },
  cart: {
    height: '100vh',
    overflowY: 'auto',
  },
  imgDiv: {
    height: '176px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  imgRoot: {
    position: 'absolute',
    objectFit: 'cover',
  },
  content: {
    height: `calc(100% - ${176 + theme.spacing(4)}px)`,
  },
}));

const showProduto = ({ produto = {} }:{ produto:any}) => {
  const classes = useStyles();
  const session = useSession();

  const [perfil, setPerfil] = useState<any>({});
  const [isTheSamePerfil, setIsTheSamePerfil] = useState(false);
  const [inputEndereco, setInputEndereco] = useState<string | undefined>();
  const [inputNome, setInputNome] = useState<string | undefined>();

  const getPerfil = async () => {
    const res = await perfisService.getPerfilByUserId(produto['perfil.userId']);
    setPerfil(res.data.data[0]);
  };

  useEffect(() => {
    getPerfil();
    return () => {
      setPerfil({});
    };
  }, []);

  useEffect(() => {
    if (session.profile.loaded && session.profile.id === perfil.id) {
      setIsTheSamePerfil(true);
    }
    setInputEndereco(session.profile.endereco || '');
    setInputNome(session.profile.nome || '');
  }, [session.profile.loaded]);

  const generateZapLink = (
    zap: number,
    paymentMethod: string,
    enderecoParam: string,
    trocoParam: number,
    obs: string,
    nome: string,
    product: any,
    quantity: number,
    prefix: string,
  ) => {
    const stringProduct = `${quantity} ${product.titulo}`;
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
    // eslint-disable-next-line consistent-return
    const getObs = () => {
      if (obs) {
        return `%0a*Observações:*%20_${obs}_%0a`;
      }
      return '';
    };
    const validateZap = () => {
      const numero = zap.toString();
      return numero;
    };
    const validatePrefix = () => {
      if (prefix) {
        return prefix;
      }
      return '';
    };
    const temTroco = validateTroco();
    const formaDeReceber = validateEntrega();
    const link = `https://api.whatsapp.com/send?phone=${validatePrefix()}${validateZap()}&text=%20Pedido%20realizado%20no%20*comprarnozap.com*%0a%0a*Nome*%0a${nome}%0a%0a*Pedido*%0a${stringProduct}%0a${getObs()}%0a*Forma%20de%20pagamento*%0a${paymentMethod}${temTroco}${formaDeReceber}`;
    return link;
  };

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
    const link = generateZapLink(
      Number(perfil.zap),
      values.metodoPagamento,
      values.entrega ? values.endereco : undefined,
      values.troco,
      values.obs,
      values.nome,
      produto,
      values.quantity,
      perfil.prefix,
    );
    const win = window.open(link, '_blank');
    win.focus();
  };

  const {
    form, handleSubmit,
  } = useForm({
    validate, // a record-level validation function to check all form values
    initialValues: { inputNome, inputEndereco },
    onSubmit, // the function to call with your form values upon valid submit☻☻
  });
  const endereco = useField('endereco', form);
  const troco = useField('troco', form);
  const entrega = useField('entrega', form);
  const metodoPagamento = useField('metodoPagamento', form);
  const obs = useField('obs', form);
  const nome = useField('nome', form);
  const quantity = useField('quantity', form);

  return (
    <ThemeProvider theme={PedirNoZapTheme}>
      <Grid container justify="space-between" style={{ height: '100%' }}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {!session.isAutheticated && (

              <Grid container justify="flex-end">
                <Grid item xs="auto" sm="auto">
                  <Box p={2}>
                    <Typography className={classes.link} component="span">
                      <Link href="/" color="inherit">
                        Pesquisar
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs="auto" sm="auto">
                  <Box p={2}>
                    <Typography className={classes.link} component="span">
                      <Link href="/entrar" color="inherit">
                        Entrar
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              )}
              {session.isAutheticated && (
              <LoggedBarIndex
                src={session.profile['picture.imgBase64']}
                name={session.profile.nome}
                zap={session.profile.zap}
                domain={session.profile.domain}
                seller={session.profile.seller}
                likes={session.profile.likecount}
                optionSearch
              />
              )}
            </Grid>
          </Grid>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Hidden xsDown>
            <Container>
              <Box p={2}>
                <Paper variant="outlined" square elevation={2}>
                  <Grid container>
                    <Grid item xs={4}>
                      <img
                        alt={produto.titulo}
                        src={produto['picture.imgBase64'] || '/empty-img.png'}
                        className={classes.img}
                        width="100%"
                        height="100%"
                      />
                    </Grid>
                    <Grid item xs={8}>
                      <Grid container alignContent="space-between" spacing={2} style={{ height: '100%' }}>
                        <Grid item xs={12}>
                          <Box p={2}>
                            <Typography variant="h4">
                              {produto.titulo}
                            </Typography>
                            <br />
                            <Typography variant="h6" color="textSecondary">
                              {produto.descricao}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs />
                            <Grid item xs="auto">
                              <Box pr={2}>
                                <Typography variant="h6" color="secondary">
                                  Valor:
                                  {' '}
                                  {formatNumberToMoneyWithSymbol(produto.valor)}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Container>
          </Hidden>
          <Hidden smUp>
            <Container>
              <Box pt={2} pb={2}>
                <Paper style={{ height: '100%' }}>
                  <div className={classes.imgDiv}>
                    <img
                      src={produto['picture.imgBase64']}
                      alt={produto.titulo}
                      height="100%"
                      width="100%"
                      className={classes.imgRoot}
                    />
                  </div>
                  <Box p={2} className={classes.content}>
                    <Grid container alignContent="space-between" style={{ height: '100%' }} spacing={2}>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography variant="h5">{produto.titulo}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography color="textSecondary">
                              {produto.descricao}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container justify="flex-end">
                          <Grid item xs={12}>
                            <Typography color="textSecondary" variant="caption">
                              Vendido por
                              {' '}
                              {perfil.nome}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body1" color="primary">
                              {formatNumberToMoneyWithSymbol(produto.valor, 'R$')}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Box>
            </Container>
          </Hidden>
        </Grid>
        <Grid item xs={12}>
          <Box p={2}>
            <Container>
              <Paper square elevation={0}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Box p={2} style={{ width: '100%' }}>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              {perfil.delivery === false && (
                              <Grid item xs>
                                <Typography>
                                  <Box fontWeight="fontWeightBold" m={1}>
                                    Apenas retiradas no local:
                                  </Box>
                                </Typography>
                                <Typography>
                                  <Box fontWeight="fontWeightMedium" m={1}>
                                    {perfil.endereco}
                                  </Box>
                                </Typography>
                              </Grid>
                              )}
                              {perfil.delivery === true && (
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
                              <Grid container>
                                <Grid item xs={12} sm={8}>
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
                                </Grid>
                                <Grid item xs />
                                <Grid item xs={12} sm={3}>
                                  <TextField
                                    error={quantity.meta.touched && quantity.meta.invalid}
                                    helperText={
                                  quantity.meta.touched
                                  && quantity.meta.invalid
                                  && quantity.meta.error
                                }
                                    {...quantity.input}
                                    label="Quantidade"
                                    type="number"
                                    fullWidth
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={12}>
                                <Grid container justify="flex-end">
                                  <Grid item xs="auto">
                                    <Button type="submit" variant="contained" color="primary">
                                      Pedir no zap
                                    </Button>
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
              </Paper>
            </Container>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container alignItems="flex-end" style={{ height: '100%' }}>
            <Grid item xs={12} className={classes.enterpriseShow}>
              <Container>
                <Box p={2}>
                  <EnterpriseExclusiveFooter
                    perfil={perfil}
                    isTheSamePerfil={isTheSamePerfil}
                  />
                </Box>
              </Container>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export async function getStaticProps({ params }:any) {
  const produtoResponse = await productsService.getById(params.id);
  return {
    props: { produto: produtoResponse.data },
  };
}

export async function getStaticPaths() {
  const allProductsId = await productsService.getAllIds();
  const paths = allProductsId.data.data.map((id: any) => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
}

export default showProduto;
