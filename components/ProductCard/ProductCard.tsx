import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";

export type ProductCardProps = {
  src?: string;
  name: string;
  descricao?: string;
  valor: string;
};

const useStyles = makeStyles({
  root: {
    maxWidth: "250px",
  },
});

function ProductCard({ src, name, descricao, valor }: ProductCardProps) {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardMedia component="img" height="200" image={src} title={name} />
      <CardContent>
        <Typography variant="h5">{name}</Typography>
        <Typography color="textSecondary">
          {descricao}
        </Typography>
        <br />
        <Typography color="primary">{valor}</Typography>
      </CardContent>
      <CardActions>
        <Grid container justify="flex-end">
          <Grid item>
          <Button variant="contained" color="primary">
            Pedir
          </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
