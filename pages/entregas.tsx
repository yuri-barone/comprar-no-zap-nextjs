import {
  Box, Container, Grid, Tab, Tabs,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import HireDeliveryShow from '../components/HireDeliveryShow';
import ImageFeedback from '../components/ImageFeedback/ImageFeedback';
import hireDeliverService from '../components/services/hireDeliverService';
import SimpleTopBar from '../components/SimpleTopBar';
import useSession from '../components/useSession';

const entregas = () => {
  const [deliverysData, setDeliverysData] = useState([]);
  const [tabValue, setTabValue] = useState<number>(0);
  const [deliverysGot, setDeliverysGot] = useState([]);
  const session = useSession();

  const loadDeliverys = async () => {
    const position = JSON.parse(localStorage.getItem('ComprarNoZapLatLng'));
    const response = await hireDeliverService.findOptimized(position);
    if (response.data) {
      setDeliverysData(response.data.data);
    }
  };

  const loadDeliverysGot = async () => {
    const response = await hireDeliverService.getHireByDeliverId(session.profile.id);
    if (response.data.data) {
      setDeliverysGot(response.data.data);
    }
  };

  const handleChangeTab = (e: any, value: number) => {
    setTabValue(value);
    if (value === 0) {
      loadDeliverys();
    } else {
      loadDeliverysGot();
    }
  };

  useEffect(() => {
    loadDeliverys();
  }, []);

  useEffect(() => {
    if (session.profile.loaded) {
      loadDeliverysGot();
    }
  }, [session]);

  return (
    <>
      <SimpleTopBar requiredLogin={false} />
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Oportunidades" />
        <Tab label="Aceitas" />
      </Tabs>
      <Container>
        <Box pt={2} pb={2}>
          <Grid container spacing={2}>
            {tabValue === 0 && deliverysData.map((delivery) => (
              <Grid item xs={12} md={6} lg={4} key={delivery.id}>
                <HireDeliveryShow
                  value={delivery.value}
                  startAddress={delivery.startAddress}
                  endAddress={delivery.endAddress}
                  hireDeliveryId={delivery.id}
                  ordersId={delivery.ordersId}
                  contractorId={delivery.contractorId}
                />
              </Grid>
            ))}
            {tabValue === 1 && deliverysGot.map((delivery) => (
              <Grid item xs={12} md={6} lg={4} key={delivery.id}>
                <HireDeliveryShow
                  value={delivery.value}
                  startAddress={delivery.startAddress}
                  endAddress={delivery.endAddress}
                  hireDeliveryId={delivery.id}
                  ordersId={delivery.ordersId}
                  contractorId={delivery.contractorId}
                />
              </Grid>
            ))}
            {tabValue === 0 && deliverysData.length === 0 && (
            <Grid item xs={12} style={{ marginTop: '32px' }}>
              <ImageFeedback
                image="/Jhon-Travolta.gif"
                message="Hmm... Nenhum pedido de entrega foi encontrado na sua região."
              />
            </Grid>
            )}
            {tabValue === 1 && deliverysGot.length === 0 && (
            <Grid item xs={12} style={{ marginTop: '32px' }}>
              <ImageFeedback
                image="/Jhon-Travolta.gif"
                message="Hmm... Nenhum pedido de entrega foi aceito por você ainda."
              />
            </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default entregas;
