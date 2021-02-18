import {
  Box, Button, Container, Dialog, Grid, makeStyles, Paper, Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import promotionsService from '../components/services/promotionsService';
import useSession from '../components/useSession';
import { formatNumberToMoneyWithSymbol } from '../formatters';

const useStyles = makeStyles((theme) => ({
  img: {
    [theme.breakpoints.only('xs')]: {
      height: '125px',
    },
    objectFit: 'cover',
    display: 'block',
  },
  content: {
    flex: '1 0 auto',
  },
  titulo: {
    height: 36,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  oldPrice: {
    textDecoration: 'line-through',
    textDecorationColor: theme.palette.text.secondary,
  },
}));

const admpromos = () => {
  const classes = useStyles();
  const [promos, setPromos] = useState(undefined);
  const [permission, setPermission] = useState(false);
  const session = useSession();

  const getPromos = async () => {
    const res = await promotionsService.findOptimized(false, undefined, 500);
    setPromos(res.data);
  };

  useEffect(() => {
    getPromos();
    return setPromos(undefined);
  }, []);

  const approvePromo = async (values:any) => {
    let toUpdate = values;
    toUpdate = { ...toUpdate, status: true };
    const res = await promotionsService.approve(toUpdate.promoid, toUpdate, session.profile.admin);
    if (res?.ok) {
      setTimeout(() => {
        getPromos();
      }, 500);
    } else {
      setPermission(true);
    }
  };

  const deletePromo = async (id:number) => {
    const res = await promotionsService.deletePromo(id, session.profile.admin);
    if (res?.ok) {
      setTimeout(() => {
        getPromos();
      }, 500);
    } else {
      setPermission(true);
    }
  };

  return (
    <>
      <Container>
        <Box pt={2} pb={2}>
          <Grid container spacing={1}>
            {promos?.map((item:any) => (
              <Grid item xs={6} md={4} sm={4} lg={3} key={item.id}>
                <Paper elevation={3}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Box p={1}>
                        <Grid container className={classes.content} alignItems="flex-end" spacing={1}>
                          <Grid item xs={12}>
                            <Typography variant="body1" title={item.titulo} className={classes.titulo}>
                              <Box fontSize={13}>
                                {item.titulo}
                              </Box>
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item xs="auto">
                                <Typography color="textSecondary" className={classes.oldPrice}>
                                  <Box fontSize={12}>
                                    {formatNumberToMoneyWithSymbol(item.prodvalue, 'R$')}
                                  </Box>
                                </Typography>
                              </Grid>
                              <Grid item xs="auto">
                                <Typography variant="h6" color="primary">
                                  <Box fontSize={13}>
                                    {formatNumberToMoneyWithSymbol(item.valor, 'R$')}
                                  </Box>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs="auto">
                            <Button size="small" onClick={() => approvePromo(item)} variant="contained" color="primary">
                              Aprovar
                            </Button>
                          </Grid>
                          <Grid item xs="auto">
                            <Button size="small" onClick={() => deletePromo(item.promoid)} variant="outlined" color="secondary">
                              Deletar
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Dialog fullScreen open={permission}>
        <Grid container alignContent="center" justify="center" style={{ height: '100%', width: '100%' }} spacing={2}>
          <Grid item xs={12}>
            <Typography align="center" variant="h3">
              Acesso negado!
            </Typography>
          </Grid>
          <Grid item xs="auto">
            <Button color="primary" variant="contained" href="/">
              Voltar para página inicial
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
};

export default admpromos;
