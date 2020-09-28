import { Grid, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import Search from "../components/Search/Search";
import productsService from "../components/services/productsService";

export default function Home() {
  const [tabValue, setTabValue] = useState(0);
  const [productsData, setProductsData] = useState([]);

  const buscarProdutos = async (filter) => {
    try {
      const productResponse = await productsService.find(filter);
      setProductsData(productResponse.data.data);
      console.log(productsData)
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTab = (e, value) => {
    setTabValue(value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item xs={2}>
            <h1>Pedir no Zap</h1>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justify="center">
          <Grid item xs={8}>
            <Search onSearch={buscarProdutos} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Produtos" />
          <Tab label="Empresas" />
        </Tabs>
      </Grid>
      {productsData.map((item, index) => {
        return (
          <Grid item xs={3} key={index}>
            <ProductCard
              name={item.titulo}
              descricao={item.descricao}
              valor={item.valor}
              src={item["picture.imgBase64"]}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
