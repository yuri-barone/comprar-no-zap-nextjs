import {
  Box, Button, ButtonGroup, Grid, Paper, Snackbar, Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { formatNumberToMoneyWithSymbol } from '../formatters';
import hireDeliverService from './services/hireDeliverService';
import ordersService from './services/ordersService';
import perfisService from './services/perfisService';
import useSession from './useSession';

type HireDeliveryShowProps = {
  startAddress: string,
  endAddress: string,
  value: number,
  hireDeliveryId: number,
  ordersId: number,
  contractorId:number
};

const HireDeliveryShow = ({
  startAddress, endAddress, value, ordersId, hireDeliveryId, contractorId,
}:HireDeliveryShowProps) => {
  const session = useSession();
  const [hireDeliveryData, setHireDelivery] = useState<any>({ status: undefined });
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [contractor, setContractor] = useState<any>();

  const loadHireDeliveryData = async () => {
    const response = await hireDeliverService.getHireByOrderId(ordersId);
    if (response.data?.data[0]) {
      setHireDelivery(response.data?.data[0]);
    }
    if (response.data?.data[0]?.status === false) {
      setTimeout(() => {
        loadHireDeliveryData();
      }, 2000);
    }
  };

  const loadItems = async () => {
    const response = await ordersService.getOrderItems(ordersId);
    if (response.data) {
      setItems(response.data);
    }
  };

  const loadContractor = async () => {
    const response = await perfisService.get(contractorId);
    if (response.data) {
      setContractor(response.data);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadHireDeliveryData();
    loadItems();
    loadContractor();
  }, []);

  const handleAccept = async () => {
    const deliver = await hireDeliverService.getById(hireDeliveryId);
    if (session.profile && session.profile.deliverman && deliver.data.status === false) {
      const response = await hireDeliverService.editHireDelivery(
        { status: true, deliverId: session.profile.id },
        hireDeliveryId,
      );
      if (response.ok) {
        handleOpen();
      }
    }
  };

  return (
    <>
      <Paper elevation={3}>
        <Box p={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography color="textSecondary">
                    De:
                    {' '}
                    {startAddress}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">
                    Para:
                    {' '}
                    {endAddress}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">
                    Items:
                    {' '}
                    {items.map((item) => `${item.titulo}, `)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="primary">
                    Por:
                    {' '}
                    {formatNumberToMoneyWithSymbol(value)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {!hireDeliveryData.status && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={handleAccept}
                >
                  Aceitar
                </Button>
              </Grid>
            )}
            {hireDeliveryData.status && (
              <Grid item xs={12}>
                <ButtonGroup fullWidth variant="contained" color="primary">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    fullWidth
                    disabled={hireDeliveryData.status}
                  >
                    Aceito
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    fullWidth
                    onClick={() => {
                      const win = window.open(`https://wa.me/55${contractor.zap}`, '_blank');
                      win.focus();
                    }}
                  >
                    Conversar
                  </Button>
                </ButtonGroup>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Aceito com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default HireDeliveryShow;
