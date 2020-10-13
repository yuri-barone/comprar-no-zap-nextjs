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
import LoggedBarProducts from "../components/LoggedBar/LoggedBarProducts";
import { getBase64, resizeImage } from "../images/base64ImageManipulator";

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
  const [openCadastroDanger, setOpenCadastroDanger] = useState(false);
  const [openCadastroSuccess, setOpenCadastroSuccess] = useState(false);
  const [openDeleteDanger, setOpenDeleteDanger] = useState(false);
  const [openEditDanger, setOpenEditDanger] = useState(false);
  const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
  const [perfil, setPerfil] = useState<any>({});
  useEffect(() => {
    searchProducts();
  }, []);

  const openSnackBarDanger = () => {
    setOpenCadastroDanger(true);
  };
  const handleCadastroDangerClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCadastroDanger(false);
  };
  const openSnackBarSuccess = () => {
    setOpenCadastroSuccess(true);
  };
  const handleCadastroSuccessClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenCadastroSuccess(false);
  };

  const openSnackBarDeleteDanger = () => {
    setOpenDeleteDanger(true);
  };
  const handleDeleteDangerClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenDeleteDanger(false);
  };
  const openSnackBarEditDanger = () => {
    setOpenEditDanger(true);
  };
  const handleEditDangerClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenEditDanger(false);
  };
  const openSnackBarDeleteSuccess = () => {
    setOpenDeleteSuccess(true);
  };
  const handleDeleteSuccessClose = (event: any, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenDeleteSuccess(false);
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
    if (!values.imgBase64) {
      const resized = await resizeImage("/empty-img.jpg")
      values.imgBase64 = resized
    }
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
        {session.isAutheticated && (
          <LoggedBarProducts
            src={session.profile["picture.imgBase64"]}
            name={session.profile.nome}
            zap={session.profile.zap}
          />
        )}
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
                  </Link>{" "}
                  e mude a opção <strong>"Quero vender"</strong>.
                </Alert>
              </Grid>
            )}

            <Grid item xs={3}>
              <ProductRegister key="new-products" onSave={salvarProduto}></ProductRegister>
            </Grid>
            {productsData &&
              productsData.map((item) => {
                return (
                  <Grid item xs={12} sm={3} key={item.id}>
                    <ProductCardShow
                      onEditError={openSnackBarEditDanger}
                      product={item}
                      onDelete={searchProducts}
                      onDeleteSuccess={openSnackBarDeleteSuccess}
                      onDeleteError={openSnackBarDeleteDanger}
                      onEditSuccess={searchProducts}
                      
                    />
                  </Grid>
                );
              })}
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openCadastroDanger}
            autoHideDuration={6000}
            onClose={handleCadastroDangerClose}
          >
            <Alert onClose={handleCadastroDangerClose} severity="error">
              Não foi possível cadastrar seu produto
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openCadastroSuccess}
            autoHideDuration={6000}
            onClose={handleCadastroSuccessClose}
          >
            <Alert onClose={handleCadastroSuccessClose} severity="success">
              Produto cadastrado com sucesso
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openDeleteDanger}
            autoHideDuration={6000}
            onClose={handleDeleteDangerClose}
          >
            <Alert onClose={handleDeleteDangerClose} severity="error">
              Houve um problema ao deletar seu produto.
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openDeleteSuccess}
            autoHideDuration={6000}
            onClose={handleDeleteSuccessClose}
          >
            <Alert onClose={handleDeleteSuccessClose} severity="success">
              Produto deletado com sucesso
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openEditDanger}
            autoHideDuration={6000}
            onClose={handleEditDangerClose}
          >
            <Alert onClose={handleEditDangerClose} severity="error">
              Houve um problema ao editar seu produto.
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </>
  );
};

export default produtos;
