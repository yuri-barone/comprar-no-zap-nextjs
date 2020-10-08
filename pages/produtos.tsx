import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  makeStyles,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProductCardShow from "../components/ProductCard/ProductCardShow";
import ProductRegister from "../components/ProductRegister/ProductRegister";
import productsService from "../components/services/productsService";
import useSession from "../components/useSession";
import jwt_decode from "jwt-decode";
import perfisService from "../components/services/perfisService";

const useStyles = makeStyles((theme) => ({
  link: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

const produtos = () => {
  const classes = useStyles();
  const [productsData, setProductsData] = useState([]);
  const session = useSession(true);
  const [openDanger, setOpenDanger] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [perfil, setPerfil] = useState<any>({});
  useEffect(() => {
    searchProducts();
  }, []);

  const openSnackBarDanger = () => {
    setOpenDanger(true);
  };
  const handleDangerClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenDanger(false);
  };
  const openSnackBarSuccess = () => {
    setOpenSuccess(true);
  };
  const handleSuccessClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSuccess(false);
  };

  const searchProducts = async () => {
    const token = localStorage.getItem("PDZT");
    if (token) {
      const decoded: any = jwt_decode(token);
      const userId = decoded.sub;
      const perfilResponse = await perfisService.getPerfilByUserId(userId);
      setPerfil(perfilResponse.data.data[0]);
      getProducts("", perfilResponse.data.data[0].id);
    }
  };

  const getProducts = async (termo: string | undefined, storeId?: number) => {
    try {
      const productResponse = await productsService.find(termo, storeId);
      setProductsData(productResponse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const salvarProduto = async (values: any) => {
    session;
    const response = await productsService.save(values);
    if (response.ok) {
      searchProducts();
      openSnackBarSuccess();
    } else {
      openSnackBarDanger();
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs></Grid>
        <Grid item xs="auto">
          <Box p={2}>
            <Typography className={classes.link}>
              <Link href="/" color="inherit">
                Ir para a página inicial
              </Link>
              <Link href="/editPerfil" color="inherit">
                Editar meu perfil
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Divider />
      <Container>
        <Box p={2}>
          <Grid container spacing={2}>
            {perfil.seller === false && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  Seus produtos não estão sendo apresentados. Para que eles
                  sejam apresentados clique{" "}
                  <Link href="/editPerfil">
                    <strong>aqui</strong>
                  </Link>
                  {" "}e mude a opção <strong>"Quero vender"</strong>.
                </Alert>
              </Grid>
            )}

            <Grid item xs={3}>
              <ProductRegister onSave={salvarProduto}></ProductRegister>
            </Grid>
            {productsData &&
              productsData.map((item) => {
                return (
                  <Grid item xs={12} sm={3} key={item.id}>
                    <ProductCardShow product={item} />
                  </Grid>
                );
              })}
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openDanger}
            autoHideDuration={6000}
            onClose={handleDangerClose}
          >
            <Alert onClose={handleDangerClose} severity="error">
              Não foi possível cadastrar seu produto
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openSuccess}
            autoHideDuration={6000}
            onClose={handleSuccessClose}
          >
            <Alert onClose={handleSuccessClose} severity="success">
              Produto cadastrado com sucesso
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </>
  );
};

export default produtos;
