import {
  Box,
  Button,
  Container,
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
    <Typography gutterBottom>
      <Typography variant="caption" component="p">{label}</Typography>
      {value}
    </Typography>
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
    <Container>
      <Grid container justify="flex-start">
        <Grid item xs={12} lg={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h2>
                PEDIDO:
                {' '}
                {order.codigo}
              </h2>
              <h4>{date}</h4>
              {items.map((item:any) => (
                <>
                  <Box pb={1}>
                    <span>
                      {item.quantidade}
                      {' '}
                      {item.titulo}
                    </span>
                    <br />
                    <span>
                      Valor:
                      {' '}
                      {formatNumberToMoneyWithSymbol(item.valorTotal)}
                    </span>
                  </Box>
                </>
              ))}
              <h2>
                Total:
                {' '}
                {formatNumberToMoneyWithSymbol(order.valorTotal)}
              </h2>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {renderInfoParam('Cliente', order.nome)}
            {renderInfoParam('Observação', order.observacao)}
            {renderInfoParam('Entregar', order.endereco)}
            {!order.delivery && (
              <Typography gutterBottom>
                <Typography variant="caption" component="p">Entrega</Typography>
                Cliente irá buscar
              </Typography>
            )}
            {renderInfoParam('Forma de pagamento', order.formaPagamento)}
            {order.formaPagamento === 'Dinheiro' && order.troco && (
              <Typography>
                <Typography variant="caption" component="p">Troco para</Typography>
                {formatNumberToMoneyWithSymbol(order.troco)}
              </Typography>
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
    </Container>
  );
};

export default pedidos;
