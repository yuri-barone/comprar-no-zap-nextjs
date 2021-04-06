import {
  Box, CircularProgress, Container, Grid, makeStyles,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import OrderShow from '../components/OrderShow';
import ordersService from '../components/services/ordersService';
import SimpleTopBar from '../components/SimpleTopBar';
import useSession from '../components/useSession';

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: theme.palette.secondary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const pedidosrecebidos = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState({});
  const session = useSession(true);

  const getOrders = async () => {
    const { id, lat, lng } = session.profile;
    const response = await ordersService.getOrderByPerfilid(id);
    if (response.ok) {
      const arranjedOrders = response.data.data.reverse();
      setOrders(arranjedOrders);
      setPosition({ lat, lng });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session.profile.loaded) {
      getOrders();
    }
  }, [session]);

  return (
    <>
      <SimpleTopBar requiredLogin />
      <Container>
        <Box pt={2} pb={2}>
          <Grid container spacing={2}>
            {loading && <CircularProgress size={50} className={classes.buttonProgress} />}
            {!loading && orders.map((order) => (
              <Grid item xs={12} key={order.id}>
                <OrderShow
                  endAddress={order.endereco}
                  code={order.codigo}
                  data={order.createdAt}
                  nome={order.nome}
                  perfilId={order.perfilId}
                  valorTotal={order.valorTotal}
                  formaPagamento={order.formaPagamento}
                  id={order.id}
                  position={position}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default pedidosrecebidos;
