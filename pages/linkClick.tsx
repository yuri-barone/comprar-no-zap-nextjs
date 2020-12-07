import { Box, Button } from '@material-ui/core';
import React from 'react';

const linkClick = () => {
  const openLink = () => {
    const link = 'https://api.whatsapp.com/send?phone=5544998159172&text=%20Pedido%20realizado%20no%20*comprarnozap.com*%0a%0a*Nome*%0aYuri%0a%0a*Pedido*%0a1%20Marmitex G com feijoada%0a%0a*Forma%20de%20pagamento*%0aCartão%0a%0a*Irei%20buscar*%0a%0a*Imprimir:*%0ahttps://comprarnozap.com/pedidos?codigo=CTC5';
    window.open(link);
  };

  return (
    <Box p={2}>
      <Button onClick={openLink} variant="contained" color="primary" fullWidth>Clickar</Button>
    </Box>
  );
};

export default linkClick;
