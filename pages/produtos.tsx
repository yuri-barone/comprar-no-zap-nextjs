import { Container, Grid } from "@material-ui/core";
import React from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import ProductRegister from "../components/ProductRegister/ProductRegister";
import productsService from "../components/services/productsService";
import useSession from "../components/useSession";

const produtos = () => {
  const session = useSession();
  const salvarProduto = (values: any) => {
    session;
    productsService.save(values);
  };
  return (
    <Container>
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <ProductRegister onSave={salvarProduto}></ProductRegister>
      </Grid>
    </Grid>
    </Container>
  );
};

export default produtos;
