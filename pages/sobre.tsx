import {
  Box, Button, Container, Grid, Hidden, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import React from 'react';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ListAltIcon from '@material-ui/icons/ListAlt';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import InstagramIcon from '@material-ui/icons/Instagram';
import FaqQuestion from '../components/FaqQuestion/FaqQuestion';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginBottom: '-6px',
  },
  iconButton: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    color: theme.palette.common.white,
  },
  footer: {
    color: 'white',
    backgroundColor: theme.palette.primary.light,
  },
  logoImage: {
    width: '100%',
  },
  containerHeight: {
    height: 'max-content',
  },
  backgroundImage: {
    background: 'url(/comprarnozapsobre.png) no-repeat fixed',
    '-webkit-background-size': 'cover',
    '-moz-background-size': 'cover',
    '-o-background-size': 'cover',
    backgroundSize: 'cover',
  },
  faqContainer: {
    backgroundColor: theme.palette.grey[200],
  },
}));

const sobre = () => {
  const classes = useStyles();

  const openLink = (link: string) => {
    const win = window.open(link, '_blank');
    win.focus();
  };

  return (
    <>
      <div className={classes.backgroundImage}>
        <Container className={classes.containerHeight}>
          <Grid container alignItems="center" style={{ height: '100%' }} spacing={4}>
            <Box p={2}>
              <Grid item xs={12}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={10}>
                    <Hidden xsDown>
                      <Grid container>
                        <Grid item sm={10} md={5} lg={5}>
                          <Box pt={4}>
                            <img src="/comprar-no-zap.svg" alt="logo" className={classes.logoImage} />
                          </Box>
                        </Grid>
                      </Grid>
                      <Typography variant="h3" color="primary">
                        <Box fontWeight="fontWeightBold" pt={1}>
                          <Box>
                            VENDA ON-LINE
                          </Box>
                          <Box>
                            SEM PAGAR TAXAS
                          </Box>
                          NEM MENSALIDADE!
                        </Box>
                      </Typography>
                    </Hidden>
                    <Hidden smUp>
                      <Typography variant="h4" color="primary">
                        <Grid container>
                          <Grid item xs={10}>
                            <Box pt={4}>
                              <img src="/comprar-no-zap.svg" alt="logo" className={classes.logoImage} />
                            </Box>
                          </Grid>
                        </Grid>
                        <Box fontWeight="fontWeightBold" pt={2}>
                          <Box>
                            VENDA ON-LINE
                          </Box>
                          <Box>
                            SEM PAGAR TAXAS
                          </Box>
                          NEM MENSALIDADE!
                        </Box>
                      </Typography>
                    </Hidden>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" color="primary">
                      Tudo isso através do seu whats, é simples e descomplicado!
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8} lg={5}>
                    <Box pb={4}>
                      <Button size="large" variant="contained" href="/cadastro" color="secondary" fullWidth>
                        registrar a minha loja!
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      <MenuBookIcon className={classes.icon} />
                      <Box pl={1} fontWeight="fontWeightBold" component="span">
                        Catálogo grátis
                      </Box>
                    </Typography>
                    <Typography variant="body1">
                      <Box pl={4}>
                        {' '}
                        Cadastre seus produtos, possibilitando um pedido de forma ágil!
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      <ListAltIcon className={classes.icon} />
                      <Box pl={1} fontWeight="fontWeightBold" component="span">
                        Pedidos pronto para impressão
                      </Box>
                    </Typography>
                    <Typography variant="body1">
                      <Box pl={4}>
                        Você recebe o pedido com todos os dados necessários.
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      <img src="/qrcode-icon.svg" alt="qrcodeIcon" height="23px" className={classes.icon} />
                      <Box pl={1} fontWeight="fontWeightBold" component="span">
                        Tecnologia QR Code
                      </Box>
                    </Typography>
                    <Typography variant="body1">
                      <Box pl={4}>
                        Ofereça acesso ao seu Catálogo Digital no ComprarNoZap.
                      </Box>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      <TrendingUpIcon className={classes.icon} />
                      <Box pl={1} fontWeight="fontWeightBold" component="span">
                        Divulgamos sua marca!
                      </Box>
                    </Typography>
                    <Typography variant="body1">
                      <Box pb={4} pl={4}>
                        {' '}
                        Quem não é visto não é lembrado, aproveite este novo canal de vendas.
                      </Box>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Container>
      </div>
      <Grid container className={classes.faqContainer} spacing={3}>
        <Grid item xs={12}>
          <Container>
            <Typography variant="h5" color="primary">
              <Box p={1} fontWeight="fontWeightBold">
                Ainda tem dúvidas?
              </Box>
            </Typography>
          </Container>
        </Grid>
        <Container>
          <Box pb={6}>
            <Grid item xs={12}>
              <Grid container alignItems="stretch" spacing={2}>
                <Grid item xs={12} md={6}>
                  <FaqQuestion
                    question={(
                      <Typography>
                        Peraí, mas é GRÁTIS  mesmo?
                      </Typography>
                  )}
                    answer="Sim, é totalmente grátis para realizar pedidos. Nosso propósito de existir é ser seu parceiro, e não seu sócio, então você sempre poderá utilizar a nossa plataforma para pedidos TOTALMENTE GRÁTIS."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FaqQuestion
                    question={(
                      <Typography>
                        Mas então como o
                        {' '}
                        <Box fontWeight="fontWeightBold" component="span">
                          Comprar no Zap
                        </Box>
                        {' '}
                        ganha dinheiro?
                      </Typography>
                    )}
                    answer="No momento essa não é uma preocupação nossa, mas futuramente ofereceremos serviços como anúncios, ou cobrando para cadastrar mais de 50 produtos por exemplo... então aproveite cadastrar seus produtos agora enquanto não temos limite!"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FaqQuestion
                    question={(
                      <Typography>
                        Dá pra imprimir o pedido?
                      </Typography>
                    )}
                    answer="Sim, você pode clicar no link e imprimir o seu pedido em qualquer impressora, seja ela térmica ou não!"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FaqQuestion
                    question={(
                      <Typography>
                        Eu consigo ter uma página só minha?
                      </Typography>
                    )}
                    answer="O seu catálogo exibe apenas os seus produtos, então está esperando o quê, envie para seus clientes agora mesmo o link da sua loja no Comprar no Zap, ou imprima o QRCode do seu catálogo digital... moderno né?"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Grid>
      <Grid container>
        <Grid item xs={12} className={classes.footer}>
          <Container>
            <Box pt={2} pb={2}>
              <Grid container justify="space-between" alignItems="center" spacing={2}>
                <Grid item xs={12} sm={5} md={4}>
                  <a href="/">
                    <img src="/comprar-no-zap-white.svg" alt="logo" className={classes.logoImage} />
                  </a>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Grid container justify="center">
                    <Grid item xs={12}>
                      <Typography align="center">
                        CONVERSE COM A GENTE!
                      </Typography>
                    </Grid>
                    <Grid item xs="auto">
                      <IconButton
                        onClick={() => {
                          openLink(
                            'https://api.whatsapp.com/send?phone=5544997737167&text=Ol%C3%A1%2C%20vi%20o%20seu%20site%20do%20Comprarno%20No%20Zap%20e%20gostaria%20de%20tirar%20alguma%20d%C3%BAvidas.',
                          );
                        }}
                      >
                        <WhatsAppIcon className={classes.iconButton} />
                      </IconButton>
                    </Grid>
                    <Grid item xs="auto">
                      <IconButton
                        onClick={() => {
                          openLink('https://www.instagram.com/comprarnozap');
                        }}
                      >
                        <InstagramIcon className={classes.iconButton} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default sobre;
