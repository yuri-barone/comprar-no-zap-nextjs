import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LoginScreen from "../components/LoginScreen/LoginScreen";
import usersService from "../components/services/usersService";
import { keepSession } from "../components/useSession";

const entrar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openSnackBar = () => {
    setOpen(true);
  };
  const handleClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const logar = async (values: any) => {
    values["strategy"] = "local";
    values.email = values.email.toLowerCase();
    const response = await usersService.login(values);
    if (response.ok) {
      keepSession(values.email.split("@")[0], response.data);
      router.push("/produtos");
    } else {
      openSnackBar();
    }
  };

  return (
    <>
      <LoginScreen onLogin={logar} />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          Login ou senha inválidos.
        </Alert>
      </Snackbar>
    </>
  );
};

export default entrar;
