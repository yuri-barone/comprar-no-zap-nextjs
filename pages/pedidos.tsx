import {
  Box, Button, Grid, makeStyles, Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ordersService from '../components/services/ordersService';
import { formatNumberToMoneyWithSymbol } from '../formatters';

const useStyles = makeStyles({
  caption: {
    fontSize: '0.60rem',
  },
  h6: {
    fontSize: '0.90rem',
  },
  body1: {
    fontSize: '0.80rem',
  },
});
const renderInfoParam = (label: string, value: string) => {
  const classes = useStyles();
  if (!value) {
    return null;
  }
  return (
    <>
      <Typography variant="caption" component="p" className={classes.caption}>
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </>
  );
};

const pedidos = () => {
  const classes = useStyles();
  const [order, setOrder] = useState<any>({});
  const [items, setItems] = useState<any>([]);
  const [date, setNewDate] = useState<string>('undefined');

  const getOrder = async () => {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const respOrder = await ordersService.getOrder(urlParams.get('codigo'));
    const respItems = await ordersService.getOrderItems(respOrder.data[0].id);
    const data = new Date(respOrder.data[0].createdAt).toLocaleString('pt-BR');
    setOrder(respOrder.data[0]);
    setItems(respItems.data);
    setNewDate(data);
  };

  useEffect(() => {
    getOrder();
  }, []);

  const imprimir = () => {
    window.print();
  };

  return (
    <>
      <Grid container justify="flex-start">
        <Grid item xs={12} lg={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.h6}>
                PEDIDO:
                {' '}
                <Box fontWeight="fontWeightBold" component="span">
                  {order.codigo}
                </Box>
              </Typography>
              <Typography variant="h6" className={classes.caption}>{date}</Typography>
              {items.map((item: any) => (
                <div key={item.id}>
                  <Box pb={1}>
                    <Typography component="span" className={classes.body1}>
                      {item.quantidade}
                      {' '}
                      {item.titulo}
                    </Typography>
                    <br />
                    <Typography component="span" className={classes.body1}>
                      Valor:
                      {' '}
                      {formatNumberToMoneyWithSymbol(item.valorTotal)}
                    </Typography>
                  </Box>
                </div>
              ))}
              <Typography variant="h6" className={classes.h6}>
                <Box fontWeight="fontWeightBold">
                  Total:
                  {' '}
                  {formatNumberToMoneyWithSymbol(order.valorTotal)}
                </Box>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {renderInfoParam('Cliente', order.nome)}
            {renderInfoParam('Observação', order.observacao)}
            <>
              <Typography variant="caption" component="p" className={classes.caption}>
                Entregar
              </Typography>
              <Typography variant="h6" className={classes.h6}>{order.endereco}</Typography>
            </>
            {!order.delivery && (
              <>
                <Typography variant="caption" component="p" className={classes.caption}>
                  Entrega
                </Typography>
                <Typography>Cliente irá buscar</Typography>
              </>
            )}
            {renderInfoParam('Forma de pagamento', order.formaPagamento)}
            {order.formaPagamento === 'Dinheiro'
              && order.troco
              && order.troco - order.valorTotal !== 0 && (
                <>
                  <>
                    <Typography variant="caption" component="p" className={classes.caption}>
                      Dinheiro do cliente:
                    </Typography>
                    <Typography variant="h6" className={classes.h6}>
                      {formatNumberToMoneyWithSymbol(order.troco)}
                    </Typography>
                  </>
                  <>
                    <Typography variant="caption" component="p" className={classes.caption}>
                      Troco:
                    </Typography>
                    <Typography variant="h6" className={classes.h6}>
                      {formatNumberToMoneyWithSymbol(
                        order.troco - order.valorTotal,
                      )}
                    </Typography>
                  </>
                </>
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="flex-end">
              <Grid item xs="auto">
                <Box pt={2} pb={2} displayPrint="none">
                  <Button variant="outlined" color="primary" onClick={imprimir}>
                    Imprimir
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default pedidos;
