import {
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';

export type EnterpriseCardProps = {
  name: string;
  zap: string;
  endereco: string;
  id: number;
  onNavigate: (store:any) => void;
};

const useStyles = makeStyles((theme) => ({
  root: {},
  avatarSize: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  maxHeigth: {
    height: '100%',
  },
}));
const EnterpriseCard = ({
  name, zap, endereco, id, onNavigate,
}: EnterpriseCardProps) => {
  const classes = useStyles();
  const handleOnSeeProducts = () => {
    onNavigate({
      id,
    });
  };
  const handleSendMessage = () => {
    const validateZap = () => {
      const numero = zap.toString();
      if (!numero.startsWith('55')) {
        return `55${numero}`;
      }
      return numero;
    };
    const link = `https://api.whatsapp.com/send?phone=${validateZap()}&text=Olá,%20te%20encontrei%20no%20*comprarnozap.com*`;
    const win = window.open(link, '_blank');
    win.focus();
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6">{name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography color="textSecondary">{endereco}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button variant="outlined" color="secondary" onClick={handleOnSeeProducts} fullWidth>
                  Ver produtos
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="secondary" fullWidth onClick={handleSendMessage}>
                  Enviar mensagem
                </Button>
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
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/1200px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg',
  name: 'Marcos Zuck e Berg',
  endereco: 'California Windows State',
  zap: '+554433221100',
};

export default EnterpriseCard;
