import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import PedirNoZapTheme from "../styles/PedirNoZapTheme";
import Search from "../components/Search/Search";

const useStyles = makeStyles((theme) => ({
  img: {
    objectFit: "cover",
    width:'100%',
  },
  imgDiv: {
    padding: 20,
  },
  containerHeight: {
    height: "100%",
  },
  link: {
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
  }
}));

export default function Home() {
  const classes = useStyles();
  const router = useRouter();
  const [filter, setFilter] = useState("")

  const handleProductSearch = () => {
    router.push(`/search?tipo=0&termo=${filter}`)
  }
  const handlePlacesSearch = () => {
    router.push(`/search?tipo=1&termo=${filter}`)
  }
  const storeFilter = (e) => {
    setFilter(e.target.value)
  }
  

  return (
    <ThemeProvider theme={PedirNoZapTheme}>
      <Grid container className={classes.containerHeight}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs></Grid>
            <Grid item xs="auto">
              <Box p={2}>
              <Typography className={classes.link}>
                <Link href="/cadastro"  color="inherit">
                Cadastrar meu estabelecimento
                </Link>
                <Link href="/cadastro" color="inherit">
                  Cadastrar-me
                </Link>
                </Typography>
                </Box>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider/>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <img
                alt=""
                src="/comprar-no-zap.svg"
                className={classes.img}
              ></img>
            </Grid>
            <Grid item xs={4} />

            <Grid item xs={3} />
            <Grid item xs={6}>
              <Search onEnter={handleProductSearch} onChange={storeFilter}></Search>
            </Grid>
            <Grid item xs={3} />

            <Grid item xs={4} />
            <Grid item xs={2}>
              <Button color="secondary" type="submit" variant="contained" onClick={handleProductSearch} fullWidth>
                Pesquisar produtos
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button color="secondary" variant="outlined" onClick={handlePlacesSearch} fullWidth>
                Pesquisar lugares
              </Button>
            </Grid>
            <Grid item xs={4} />

            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary" align="center">
                Não perca tempo procurando, o{" "}
                <Box component="span" fontWeight="fontWeightBold">
                  Comprar no zap
                </Box>{" "}
                já organizou tudo para você!
              </Typography>
              <Typography variant="h6" color="textSecondary" align="center">
                Hambúrgueres, lanches, porções, eletrônicos, roupas...{" "}
                <Box component="span" fontWeight="fontWeightBold">
                  se tem zap está aqui
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
