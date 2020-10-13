import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Fade,
  Grid,
  IconButton,
  makeStyles,
  Modal,
  Paper,
  Snackbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Backdrop from "@material-ui/core/Backdrop";
import { formatNumberToMoneyWithSymbol } from "../../formatters";
import red from "@material-ui/core/colors/red";
import productsService from "../services/productsService";
import { Alert } from "@material-ui/lab";
import ProductRegister from "../ProductRegister/ProductRegister";

export type ProductCardProps = {
  product: any;
  onDelete: () => void;
  onDeleteSuccess: () => void;
  onDeleteError: () => void;
  onEditError: () => void;
  onEditSuccess: () => void;
};
const imgHeight = 176;
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  content: {
    height: `calc(100% - ${imgHeight + theme.spacing(4)}px)`
  },
  atEnd: {
    alignSelf: "flex-end",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },
  imgDiv: {
    height: imgHeight,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
  },
  imgRoot: {
    position: "absolute",
    objectFit: "cover",
  },
  hideName: {
    maxWidth: theme.spacing(10),
    textOverflow: "ellipsis",
    overflow: "hidden",
    color: 'black',
    
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
}))(Button);

function ProductCard({
  product,
  onDelete,
  onDeleteSuccess,
  onDeleteError,
  onEditError,
  onEditSuccess,
}: ProductCardProps) {
  const classes = useStyles();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const deleteProduct = async () => {
    const response = await productsService.deleteProduct(product.id);
    if (response.ok) {
      handleCloseDelete();
      onDeleteSuccess();
      onDelete();
    } else {
      onDeleteError();
      handleCloseDelete();
    }
  };

  const saveEditProduct = async (values: any) => {
    const response = await productsService.edit(product.id, values);
    if (response.ok) {
      setIsEditing(false);
      product.titulo = response.data.titulo;
      product["picture.imgBase64"] = response.data["picture.imgBase64"];
      product.descricao = response.data.descricao;
      product.valor = response.data.valor;
      onEditSuccess();
    } else {
      onEditError();
    }
  };

  if (isEditing) {
    return (
      <ProductRegister
        defaultImage={product["picture.imgBase64"]}
        onSave={saveEditProduct}
        initialValues={product}
        onCancel={() => setIsEditing(false)}
      ></ProductRegister>
    );
  }
  return (
    <>
      <Paper className={classes.root}>
        <div className={classes.imgDiv}>
          <img
            src={product["picture.imgBase64"]}
            alt={product.titulo}
            height="100%"
            width="100%"
            className={classes.imgRoot}
          ></img>
        </div>
        <Box p={2} className={classes.content}>
          <Grid container alignContent="space-between" className={classes.root}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5">{product.titulo}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">
                    {product.descricao}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="caption">
                    Vendido por {product["perfil.nome"]}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="primary">
                    {formatNumberToMoneyWithSymbol(product.valor, "R$")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
            <Grid container justify="flex-end">
            <Grid item xs="auto">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenDelete}
              >
                Deletar
              </Button>{" "}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            </Grid>
          </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openDelete}
        onClose={handleCloseDelete}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDelete}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={product["picture.imgBase64"]}
              title={product.titulo}
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="h5" className={classes.hideName} noWrap>{product.titulo}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary" className={classes.hideName} noWrap>
                    {product.descricao}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" color="primary">
                    {formatNumberToMoneyWithSymbol(product.valor, "R$")}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="h6">
                    {product["perfil.nome"]}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <ColorButton
                    variant="contained"
                    fullWidth
                    onClick={deleteProduct}
                  >
                    Deletar
                  </ColorButton>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCloseDelete}
                    fullWidth
                  >
                    Cancelar
                  </Button>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Fade>
      </Modal>
    </>
  );
}

ProductCard.defaultProps = {
  src:
    "data:image/jpeg;base64,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",
  name: "Hamburguer",
  descricao: "Hamburguer de presunto e quejo",
  valor: 500.5,
};

export default ProductCard;
