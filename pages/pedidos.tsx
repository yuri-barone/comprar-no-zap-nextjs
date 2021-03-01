import {
  Box,
  Button,
  Grid,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ordersService from '../components/services/ordersService';
import { formatNumberToMoneyWithSymbol } from '../formatters';

const renderInfoParam = (label:string, value: string) => {
  if (!value) {
    return null;
  }
  return (
    <>
      <Typography variant="h4" component="p">{label}</Typography>
      <Typography variant="h3">
        {value}
      </Typography>
    </>
  );
};

const pedidos = () => {
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
              <Typography variant="h5">
                PEDIDO:
                {' '}
                <Box fontWeight="fontWeightBold" component="span">
                  {order.codigo}
                </Box>
              </Typography>
              <Typography variant="h5">{date}</Typography>
              {items.map((item:any) => (
                <div key={item.id}>
                  <Box pb={1}>
                    <Typography variant="h4" component="span">
                      {item.quantidade}
                      {' '}
                      {item.titulo}
                    </Typography>
                    <br />
                    <Typography variant="h4" component="span">
                      Valor:
                      {' '}
                      {formatNumberToMoneyWithSymbol(item.valorTotal)}
                    </Typography>
                  </Box>
                </div>
              ))}
              <Typography variant="h3">
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
            <br />
            {renderInfoParam('Observação', order.observacao)}
            <br />
            {renderInfoParam('Entregar', order.endereco)}
            <br />
            {!order.delivery && (
              <>
                <Typography variant="h3" component="p">Entrega</Typography>
                <Typography variant="h4">
                  Cliente irá buscar
                </Typography>
                <br />
              </>
            )}
            {renderInfoParam('Forma de pagamento', order.formaPagamento)}
            <br />
            {order.formaPagamento === 'Dinheiro' && order.troco && (order.troco - order.valorTotal !== 0) && (
              <>
                <>
                  <Typography variant="h4" component="p">Dinheiro do cliente:</Typography>
                  <Typography variant="h3">
                    {formatNumberToMoneyWithSymbol(order.troco)}
                  </Typography>
                  <br />
                </>
                <>
                  <Typography variant="h4" component="p">Troco:</Typography>
                  <Typography variant="h3">
                    {formatNumberToMoneyWithSymbol(order.troco - order.valorTotal)}
                  </Typography>
                  <br />
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
