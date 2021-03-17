import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import ProductCardShow from '../components/ProductCard/ProductCardShow';
import ProductRegister from '../components/ProductRegister/ProductRegister';
import productsService from '../components/services/productsService';
import useSession from '../components/useSession';
import perfisService from '../components/services/perfisService';
import LoggedBarProducts from '../components/LoggedBar/LoggedBarProducts';

const produtos = ({ uploaderKey }:{uploaderKey:string}) => {
  const [productsData, setProductsData] = useState([]);
  const [openCadastroDanger, setOpenCadastroDanger] = useState(false);
  const [openCadastroSuccess, setOpenCadastroSuccess] = useState(false);
  const [openDeleteDanger, setOpenDeleteDanger] = useState(false);
  const [openEditDanger, setOpenEditDanger] = useState(false);
  const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
  const [perfil, setPerfil] = useState<any>({});
  const session = useSession(true);
  // eslint-disable-next-line consistent-return
  const getProducts = async (termo: string | undefined, storeId?: number) => {
    try {
      const productResponse = await productsService.findOptimized(termo, storeId, undefined, 400);
      setProductsData(productResponse.data.data);
    } catch (error) {
      return error;
    }
  };

  const searchProducts = async () => {
    const token = localStorage.getItem('PDZT');
    if (token) {
      const decoded: any = jwt_decode(token);
      const userId = decoded.sub;
      const perfilResponse = await perfisService.getPerfilByUserId(userId);
      setPerfil(perfilResponse.data.data[0]);
      getProducts('', perfilResponse.data.data[0].id);
    }
  };

  useEffect(() => {
    searchProducts();
  }, []);

  const openSnackBarDanger = () => {
    setOpenCadastroDanger(true);
  };
  const handleCadastroDangerClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenCadastroDanger(false);
  };
  const openSnackBarSuccess = () => {
    setOpenCadastroSuccess(true);
  };
  const handleCadastroSuccessClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenCadastroSuccess(false);
  };

  const openSnackBarDeleteDanger = () => {
    setOpenDeleteDanger(true);
  };
  const handleDeleteDangerClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenDeleteDanger(false);
  };
  const openSnackBarEditDanger = () => {
    setOpenEditDanger(true);
  };
  const handleEditDangerClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenEditDanger(false);
  };
  const openSnackBarDeleteSuccess = () => {
    setOpenDeleteSuccess(true);
  };
  const handleDeleteSuccessClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenDeleteSuccess(false);
  };

  const salvarProduto = async (values: any) => {
    const params:any = values;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    session;
    const response = await productsService.save(params);
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
        <Grid item xs />
        {session.isAutheticated && (
          <LoggedBarProducts
            src={session.profile['picture.imgBase64']}
            name={session.profile.nome}
            zap={session.profile.zap}
            domain={session.profile.domain}
            seller={session.profile.seller}
            consumerid={session.profile.id}
          />
        )}
      </Grid>
      <Divider />
      <Container>
        <Box pt={2}>
          <Grid container spacing={2} alignItems="stretch">
            {perfil.seller === false && (
              <Grid item xs={12}>
                <Alert severity="warning">
                  Seus produtos não estão sendo apresentados. Para que eles
                  sejam apresentados clique
                  {' '}
                  <Link href="/editPerfil">
                    <strong>aqui</strong>
                  </Link>
                  {' '}
                  e mude a opção
                  {' '}
                  <strong>&quot;Quero vender&quot;</strong>
                  .
                </Alert>
              </Grid>
            )}

            <Grid item xs={12} md={4} sm={6} lg={3}>
              <ProductRegister key="new-products" onSave={salvarProduto} uploaderKey={uploaderKey} />
            </Grid>
            {productsData
              && productsData.map((item) => (
                <Grid item xs={12} md={4} sm={6} lg={3} key={item.id}>
                  <ProductCardShow
                    onEditError={openSnackBarEditDanger}
                    product={item}
                    onDelete={searchProducts}
                    onDeleteSuccess={openSnackBarDeleteSuccess}
                    onDeleteError={openSnackBarDeleteDanger}
                    onEditSuccess={searchProducts}
                  />
                </Grid>
              ))}
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openCadastroDanger}
            autoHideDuration={6000}
            onClose={handleCadastroDangerClose}
          >
            <Alert severity="error">
              Não foi possível cadastrar seu produto
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openCadastroSuccess}
            autoHideDuration={6000}
            onClose={handleCadastroSuccessClose}
          >
            <Alert severity="success">
              Produto cadastrado com sucesso
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openDeleteDanger}
            autoHideDuration={6000}
            onClose={handleDeleteDangerClose}
          >
            <Alert severity="error">
              Houve um problema ao deletar seu produto.
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openDeleteSuccess}
            autoHideDuration={6000}
            onClose={handleDeleteSuccessClose}
          >
            <Alert severity="success">
              Produto deletado com sucesso
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openEditDanger}
            autoHideDuration={6000}
            onClose={handleEditDangerClose}
          >
            <Alert severity="error">
              Houve um problema ao editar seu produto.
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </>
  );
};
// eslint-disable-next-line max-len
export const getStaticProps = async () => ({ props: { uploaderKey: Math.random().toString(36).substr(2, 5) } });
export default produtos;
