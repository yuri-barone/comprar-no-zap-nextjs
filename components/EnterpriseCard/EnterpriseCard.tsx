import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import QuestionAnswerOutlinedIcon from '@material-ui/icons/QuestionAnswerOutlined';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import pictureService from '../services/pictureService';
import Clap from '../icons/Clap';
import Claped from '../icons/Claped';

export type EnterpriseCardProps = {
  name: string;
  zap: string;
  endereco: string;
  id: number;
  pictureId?: number;
  onNavigate?: (store:any) => void;
  distance?: number;
  prefix: string;
  likecount: number;
  toggleLike: (storeId:number) => void;
  liked: boolean;
};

const useStyles = makeStyles((theme) => ({
  avatarSize: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    cursor: 'pointer',
  },
  maxHeigth: {
    height: '100%',
  },
  link: {
    cursor: 'pointer',
  },
  iconsBtn: {
    borderRadius: 0,
  },
}));
const EnterpriseCard = ({
  name, zap, endereco, id, onNavigate, pictureId, distance, prefix, liked, likecount, toggleLike,
}: EnterpriseCardProps) => {
  const [src, setSrc] = useState<string | undefined>();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
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
      <Grid container className={classes.maxHeigth}>
        <Grid item xs={12}>
          <Box p={2}>
            <Grid container justify="center" alignItems="center" spacing={2} className={classes.maxHeigth}>
              <Grid item xs="auto">
                {src ? (
                  <a onClick={onNavigate ? handleOnSeeProducts : undefined} aria-hidden="true">
                    <Avatar src={src} className={classes.avatarSize} />
                  </a>
                ) : (
                  <Skeleton animation="wave" variant="circle" width={theme.spacing(10)} height={theme.spacing(10)} />
                )}
              </Grid>
              <Grid item xs>
                <Grid container>
                  <Grid item xs={12}>
                    <a onClick={onNavigate ? handleOnSeeProducts : undefined} aria-hidden="true">
                      <Typography variant="h6" className={classes.link}>{name}</Typography>
                    </a>
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
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box pl={2} pr={2}>
            <Grid container justify="space-between">
              <Grid item xs="auto">
                {!!onNavigate && (
                <IconButton className={classes.iconsBtn} aria-label="see products" onClick={handleOnSeeProducts}>
                  <LocalMallOutlinedIcon />
                  <Typography component="span" color="textSecondary" variant="caption">
                    <Box pl={1} fontWeight="fontWeightBold">
                      Ver produtos
                    </Box>
                  </Typography>
                </IconButton>
                )}
                <IconButton className={classes.iconsBtn} aria-label="talk" onClick={handleSendMessage}>
                  <QuestionAnswerOutlinedIcon />
                  {!isXs && (
                  <Typography component="span" color="textSecondary" variant="caption">
                    <Box pl={1} fontWeight="fontWeightBold">
                      Conversar
                    </Box>
                  </Typography>
                  )}
                </IconButton>
              </Grid>
              <Grid item xs="auto">
                <IconButton className={classes.iconsBtn} aria-label="share" onClick={() => (toggleLike(id))}>
                  {!liked && (
                  <Clap />
                  )}
                  {liked && (
                  <Claped />
                  )}
                  {!likecount && !isXs && (
                  <Typography component="span" color="textSecondary" variant="caption">
                    <Box pl={1} fontWeight="fontWeightBold">
                      Curtir
                    </Box>
                  </Typography>
                  )}
                  {!!likecount && (
                  <Typography component="span" color="textSecondary" variant="caption">
                    <Box pl={1} fontWeight="fontWeightBold">
                      {likecount}
                    </Box>
                  </Typography>
                  )}
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default EnterpriseCard;
