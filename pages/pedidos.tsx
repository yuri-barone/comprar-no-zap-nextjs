import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
      <Grid container justify="center">
        <Grid item xs={12} lg={4}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box pt={2}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><h2>PEDIDO</h2></TableCell>
                        <TableCell align="center"><h2>{order.codigo}</h2></TableCell>
                        <TableCell align="right"><h4>{date}</h4></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableHead>
                      <TableRow>
                        <TableCell>Items</TableCell>
                        <TableCell align="right">Valor</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item:any) => (
                        <TableRow key={item.titulo}>
                          <TableCell component="th" scope="row">
                            {item.quantidade}
                            {' '}
                            {item.titulo}
                          </TableCell>
                          <TableCell align="right">{formatNumberToMoneyWithSymbol(item.valorUnitario)}</TableCell>
                          <TableCell align="right">{formatNumberToMoneyWithSymbol(item.valorTotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableHead>
                      <TableRow>
                        <TableCell><h2>Total</h2></TableCell>
                        <TableCell align="center" />
                        <TableCell align="right"><h3>{formatNumberToMoneyWithSymbol(order.valorTotal)}</h3></TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box pt={2}>
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
            </Box>
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
