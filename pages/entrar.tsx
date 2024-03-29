import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import LoginScreen from '../components/LoginScreen/LoginScreen';
import usersService from '../components/services/usersService';
import { keepSession } from '../components/useSession';

const entrar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openSnackBar = () => {
    setOpen(true);
  };
  const handleClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const logar = async (values: any) => {
    const params:any = values;
    params.strategy = 'local';
    const response = await usersService.login(params);
    if (response.ok && response.perfil.seller) {
      keepSession(params.phone, response.data);
      router.push('/produtos');
    }
    if (response.ok && !response.perfil.seller) {
      keepSession(params.phone, response.data);
      router.push('/');
    }
    if (!response.ok) {
      openSnackBar();
    }
  };

  return (
    <>
      <LoginScreen onLogin={logar} />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert severity="error">
          Login ou senha inválidos.
        </Alert>
      </Snackbar>
    </>
  );
};

export default entrar;
