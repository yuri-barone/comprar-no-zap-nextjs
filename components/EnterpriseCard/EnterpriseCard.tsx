import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import pictureService from '../services/pictureService';

export type EnterpriseCardProps = {
  name: string;
  zap: string;
  endereco: string;
  id: number;
  pictureId?: number;
  onNavigate: (store:any) => void;
  distance?: number;
  prefix: string;
};

const useStyles = makeStyles((theme) => ({
  avatarSize: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  maxHeigth: {
    height: '100%',
  },
}));
const EnterpriseCard = ({
  name, zap, endereco, id, onNavigate, pictureId, distance, prefix,
}: EnterpriseCardProps) => {
  const [src, setSrc] = useState<string | undefined>();
  const theme = useTheme();
  // eslint-disable-next-line consistent-return
  const getSrc = async () => {
    try {
      const pictureResponse = await pictureService.get(pictureId);
      setSrc(pictureResponse.data.imgBase64);
      if (!pictureResponse.data.imgBase64) {
        setSrc('/empty-profile.png');
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getSrc();
  }, []);

  const classes = useStyles();
  const handleOnSeeProducts = () => {
    onNavigate({
      id,
    });
  };
  const handleSendMessage = () => {
    const validateZap = () => {
      const numero = zap.toString();
      return numero;
    };
    const validatePrefix = () => {
      if (prefix) {
        return prefix;
      }
      return '';
    };
    const link = `https://api.whatsapp.com/send?phone=${validatePrefix()}${validateZap()}&text=Olá,%20te%20encontrei%20no%20*comprarnozap.com*`;
    const win = window.open(link, '_blank');
    win.focus();
  };

  return (
    <Card className={classes.maxHeigth}>
      <Grid container alignItems="center" className={classes.maxHeigth}>
        <Grid item xs={12}>
          <CardContent>
            <Grid container alignItems="center" spacing={2} className={classes.maxHeigth}>
              <Grid item xs="auto">
                {src ? (
                  <Avatar src={src} className={classes.avatarSize} />
                ) : (
                  <Skeleton animation="wave" variant="circle" width={theme.spacing(10)} height={theme.spacing(10)} />
                )}
              </Grid>
              <Grid item xs>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6">{name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color="textSecondary">{endereco}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {distance > 0 && (
                    <Typography color="secondary">
                      A
                      {' '}
                      {distance}
                      km de você
                    </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button variant="outlined" color="primary" onClick={handleOnSeeProducts} fullWidth>
                      Ver produtos
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" fullWidth onClick={handleSendMessage}>
                      Enviar mensagem
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default EnterpriseCard;
