import { Button } from '@material-ui/core';
import React from 'react';

const linkTeste = () => {
  const clickLink = () => {
    const link = 'https://api.whatsapp.com/send?phone=5544997737167&text=%20Pedido%20realizado%20no%20*comprarnozap.com*%0a%0a*Nome*%0aYuri%0a%0a*Pedido*%0a%0a*Forma%20de%20pagamento*%0a';
    const win = window.open(link);
    win.focus();
  };
  return (
    <div>
      <Button variant="contained" color="primary" fullWidth onClick={clickLink}>click</Button>
    </div>
  );
};

export default linkTeste;
