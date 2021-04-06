/* eslint-disable max-len */
import {
  Box, Card, Grid, Typography,
} from '@material-ui/core';
import React from 'react';
import { formatNumberToMoneyWithSymbol } from '../formatters';
import HireDeliveryButton from './HireDeliveryButton';

type OrderShowProps = {
  endAddress: string,
  code: string,
  data: string,
  nome: string,
  perfilId: number,
  formaPagamento: string,
  valorTotal: number,
  id: number,
  position: any,
};

const OrderShow = ({
  endAddress, code, data, nome, perfilId, valorTotal, formaPagamento, id, position,
}:OrderShowProps) => (
  <>
    <Card>
      <Box p={2}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={8}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs="auto">
                <Typography variant="h6">
                  {code}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="body1" color="textSecondary">
                  {new Date(data).toLocaleString('pt-BR')}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {nome}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {formatNumberToMoneyWithSymbol(valorTotal)}
                  {' '}
                  (
                  {formaPagamento}
                  )
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <HireDeliveryButton orderId={id} perfilId={perfilId} endAddress={endAddress} position={position} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  </>
);

export default OrderShow;
