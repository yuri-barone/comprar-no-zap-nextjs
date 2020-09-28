import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Height } from "@material-ui/icons";
import React from "react";

export type EnterpriseCardProps = {
  src?: string;
  name: string;
  zap: string;
  endereco: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
  
  },
  avatarSize: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  maxHeigth: {
    height:"100%",
  },
}));
const EnterpriseCard = ({ src, name, zap, endereco }: EnterpriseCardProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container>
          <Grid item xs={5}>
            <Grid container justify="center">
              <Grid item xs>
                <Avatar
                  alt="Remy Sharp"
                  src={src}
                  className={classes.avatarSize}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7}>
            <Grid container spacing={2} alignContent="center" className={classes.maxHeigth}>
              <Grid item xs={12}>
                <Typography variant="h6">{name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="primary">{zap}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textSecondary">{endereco}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" color="primary">Ver produtos</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

EnterpriseCard.defaultProps = {
  src:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/1200px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
  name: "Marcos Zuck e Berg",
  endereco: "California Windows State",
  zap: "+554433221100",
};

export default EnterpriseCard;
